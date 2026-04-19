import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { e164ToWhatsAppTo } from "./phone.util";

/** Envío vía WhatsApp Cloud API (Meta). Requiere plantilla aprobada con parámetros de body alineados. */
@Injectable()
export class WhatsappCloudService {
  private readonly logger = new Logger(WhatsappCloudService.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return !!(
      this.config.get<string>("WHATSAPP_CLOUD_ACCESS_TOKEN")?.trim() &&
      this.config.get<string>("WHATSAPP_CLOUD_PHONE_NUMBER_ID")?.trim() &&
      this.config.get<string>("WHATSAPP_INVITE_TEMPLATE_NAME")?.trim()
    );
  }

  /**
   * Envía un mensaje de plantilla. `bodyParameters` debe coincidir con el orden de variables
   * de la plantilla en Meta (p. ej. nombre completo, enlace).
   */
  async sendTemplateMessage(e164Phone: string, bodyParameters: string[]): Promise<void> {
    const token = this.config.get<string>("WHATSAPP_CLOUD_ACCESS_TOKEN")?.trim();
    const phoneId = this.config.get<string>("WHATSAPP_CLOUD_PHONE_NUMBER_ID")?.trim();
    const version = this.config.get<string>("WHATSAPP_CLOUD_API_VERSION")?.trim() || "v21.0";
    const templateName = this.config.get<string>("WHATSAPP_INVITE_TEMPLATE_NAME")?.trim();
    const lang = this.config.get<string>("WHATSAPP_INVITE_TEMPLATE_LANG")?.trim() || "es";

    if (!token || !phoneId || !templateName) {
      throw new Error("WhatsApp Cloud API no configurada (token, phone_number_id, plantilla)");
    }

    const to = e164ToWhatsAppTo(e164Phone);
    const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;

    const body = {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: lang },
        components: [
          {
            type: "body",
            parameters: bodyParameters.map((text) => ({
              type: "text",
              text: text.slice(0, 1024),
            })),
          },
        ],
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      const err = json as { error?: { message?: string; error_user_msg?: string } };
      const msg =
        err.error?.message || err.error?.error_user_msg || JSON.stringify(json);
      this.logger.warn(`WhatsApp API error: ${msg}`);
      throw new Error(msg);
    }
  }
}
