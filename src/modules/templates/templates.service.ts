import { Injectable } from "@nestjs/common";
import { EventType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(eventType?: EventType) {
    return this.prisma.template.findMany({
      where: eventType ? { eventType } : undefined,
      orderBy: { createdAt: "asc" },
    });
  }

  findById(id: string) {
    return this.prisma.template.findUnique({ where: { id } });
  }
}
