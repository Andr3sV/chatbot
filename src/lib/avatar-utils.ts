import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

/**
 * Genera una ilustración de avatar única basada en el seed (nombre o teléfono).
 * Usa DiceBear con estilo lorelei (ilustraciones coloridas y divertidas).
 */
export function getAvatarDataUri(seed: string, size = 88): string {
  return createAvatar(lorelei, {
    seed,
    size,
  }).toDataUri();
}
