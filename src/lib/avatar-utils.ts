import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

/**
 * Genera una ilustración de avatar única basada en el seed (nombre o teléfono).
 * Usa DiceBear con estilo lorelei (ilustraciones coloridas y divertidas).
 * @param seed - Identificador único (nombre o teléfono)
 * @param size - Tamaño en píxeles
 * @param backgroundColorHex - Color de fondo en hex sin # (ej: "4ade80")
 */
export function getAvatarDataUri(
  seed: string,
  size = 88,
  backgroundColorHex?: string
): string {
  return createAvatar(lorelei, {
    seed,
    size,
    backgroundColor: backgroundColorHex
      ? [backgroundColorHex]
      : ["transparent"],
  }).toDataUri();
}
