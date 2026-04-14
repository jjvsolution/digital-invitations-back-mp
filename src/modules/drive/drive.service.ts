import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;

  constructor() {
    const privateKey = (process.env.GOOGLE_DRIVE_PRIVATE_KEY ?? '').replace(
      /\\n/g,
      '\n',
    );

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(
    file: Express.Multer.File,
    slug: string,
  ): Promise<{ id: string; viewUrl: string; name: string }> {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      throw new InternalServerErrorException(
        'GOOGLE_DRIVE_FOLDER_ID no configurado',
      );
    }

    const fileName = `${slug}-${Date.now()}-${file.originalname}`;
    const stream = Readable.from(file.buffer);

    let fileId: string;
    try {
      const res = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: file.mimetype,
          body: stream,
        },
        fields: 'id',
        supportsAllDrives: true,
      });
      fileId = res.data.id!;
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Error subiendo a Drive: ${err?.message ?? err}`,
      );
    }

    // Hacer el archivo visible para cualquiera con el enlace
    await this.drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return {
      id: fileId,
      viewUrl: `https://drive.google.com/uc?id=${fileId}&export=view`,
      name: fileName,
    };
  }
}
