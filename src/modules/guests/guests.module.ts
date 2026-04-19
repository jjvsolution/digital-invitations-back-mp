import { Module } from "@nestjs/common";
import { GuestsController } from "./guests.controller";
import { GuestsService } from "./guests.service";
import { WhatsappCloudService } from "./whatsapp-cloud.service";

@Module({
  controllers: [GuestsController],
  providers: [GuestsService, WhatsappCloudService],
  exports: [GuestsService],
})
export class GuestsModule {}
