export const propuestasPendientes = [
  {
    id: "p1",
    title: "Una noche perfecta empieza con una buena copa",
    caption:
      "Nuestra carta de vinos te espera. Maridajes sugeridos y ambiente único. Reserva tu mesa. #VinoYCena #BarDeVinos #Reservas",
    platform: "Instagram",
    scheduledAt: "18 Feb 2026, 10:00",
    image: "/Imagen1.jpg",
    imagePlaceholder: "bg-gradient-to-br from-amber-100 to-green-100",
  },
  {
    id: "p2",
    title: "Cata de vinos este viernes",
    caption:
      "Únete a nuestra cata guiada. Varietales españoles y charcutería de la casa. Plazas limitadas. #CataDeVinos #ViernesDeVino",
    platform: "Instagram",
    scheduledAt: "20 Feb 2026, 12:00",
    image: "/Imagen2.jpg",
    imagePlaceholder: "bg-gradient-to-br from-green-50 to-emerald-100",
  },
  {
    id: "p3",
    title: "Nuevas tapas para maridar con tu vino favorito",
    caption:
      "Tapas creadas para acompañar cada copa. Te esperamos de martes a domingo. #Tapas #Maridaje #BarDeVinos",
    platform: "Instagram",
    scheduledAt: "22 Feb 2026, 09:00",
    image: "/Imagen3.jpg",
    imagePlaceholder: "bg-gradient-to-br from-teal-50 to-cyan-100",
  },
];

export function getPropuestaById(id: string) {
  return propuestasPendientes.find((p) => p.id === id) ?? propuestasPendientes[0];
}
