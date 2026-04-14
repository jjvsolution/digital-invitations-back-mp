import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { PublicModule } from './modules/public/public.module';
import { RsvpModule } from './modules/rsvp/rsvp.module';
import { MusicModule } from './modules/music/music.module';
import { GiftsModule } from './modules/gifts/gifts.module';
import { PhotosModule } from './modules/photos/photos.module';
import { DriveModule } from './modules/drive/drive.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TemplatesModule,
    InvitationsModule,
    PublicModule,
    RsvpModule,
    MusicModule,
    GiftsModule,
    PhotosModule,
    DriveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
