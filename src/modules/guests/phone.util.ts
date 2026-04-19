import { BadRequestException } from "@nestjs/common";

/** Solo dígitos, sin prefijo + */
export function phoneToDigits(input: string): string {
  return input.replace(/\D/g, "");
}

/** Normaliza a E.164 (+ y código país). Requiere 8–15 dígitos. */
export function toE164(input: string): string {
  const d = phoneToDigits(input);
  if (d.length < 8 || d.length > 15) {
    throw new BadRequestException("Teléfono inválido: use código de país (8–15 dígitos)");
  }
  return `+${d}`;
}

/** Formato `to` de WhatsApp Cloud API (sin +). */
export function e164ToWhatsAppTo(e164: string): string {
  return e164.replace(/^\+/, "");
}
