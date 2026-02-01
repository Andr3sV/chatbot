/**
 * Genera sugerencias contextuales para la barbería de Luis
 * basadas en el mensaje del cliente.
 */
export function generateBarbershopSuggestion(clientMessage: string): string {
  const lower = clientMessage.toLowerCase().trim();

  const availabilityKeywords = [
    "reserva",
    "disponibilidad",
    "cita",
    "mañana",
    "espacio",
    "espacios",
    "disponible",
    "agendar",
  ];
  if (availabilityKeywords.some((k) => lower.includes(k))) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return `¡Hola! Sí, tenemos espacios disponibles. ¿Te gustaría reservar para ${dateStr}? Tenemos 10:00 AM y 4:00 PM disponibles.`;
  }

  const priceKeywords = ["precio", "cuánto", "costo", "tarifa", "cuesta"];
  if (priceKeywords.some((k) => lower.includes(k))) {
    return "Nuestro corte está en $150 MXN. Barba $80. Corte + barba $200. ¿Te interesa alguno?";
  }

  const scheduleKeywords = [
    "horario",
    "abierto",
    "cerrado",
    "horas",
    "atención",
  ];
  if (scheduleKeywords.some((k) => lower.includes(k))) {
    return "Estamos abiertos lunes a sábado de 9:00 AM a 7:00 PM. Domingos cerrado.";
  }

  const greetingKeywords = ["hola", "buenos días", "buenas tardes", "buenas noches"];
  if (greetingKeywords.some((k) => lower.includes(k))) {
    return "¡Hola! Bienvenido a Barbería Luis. ¿En qué puedo ayudarte?";
  }

  return "Gracias por escribir. ¿Necesitas reservar cita, conocer precios o nuestro horario?";
}
