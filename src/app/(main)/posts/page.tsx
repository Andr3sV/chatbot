"use client";

import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Instagram, Calendar, List, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type PostFilter = "pendientes" | "proximas" | "aprobadas";

const parseDateKey = (scheduledAt: string) => {
  const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
  const [day, month, year] = scheduledAt.split(/[\s,]+/);
  const m = month in months ? months[month] : "01";
  return `${year}-${m}-${day.padStart(2, "0")}`;
};

import { propuestasPendientes } from "@/lib/mock-posts";
import { MayaMessageBlock } from "@/components/home/MayaInsightsBlock";

const proximasPropuestas = [
  { id: "n1", title: "Menú de temporada primavera", scheduledAt: "5 Mar 2026, 14:00", imagePlaceholder: "bg-gradient-to-br from-amber-100 to-orange-100" },
  { id: "n2", title: "Horario de tapas y vino", scheduledAt: "12 Mar 2026, 11:00", imagePlaceholder: "bg-gradient-to-br from-slate-100 to-slate-200" },
  { id: "n3", title: "Nueva carta de vinos", scheduledAt: "18 Mar 2026, 09:00", imagePlaceholder: "bg-gradient-to-br from-emerald-50 to-teal-100" },
  { id: "n4", title: "Evento: noche de jazz y vino", scheduledAt: "24 Mar 2026, 18:00", imagePlaceholder: "bg-gradient-to-br from-violet-50 to-purple-100" },
];

const propuestasAprobadas = [
  { id: "a1", title: "Inauguración terraza de verano", platform: "Instagram", scheduledAt: "10 Jan 2026, 11:00", imagePlaceholder: "bg-gradient-to-br from-pink-50 to-rose-100" },
  { id: "a2", title: "Vino de la casa del mes", platform: "Instagram", scheduledAt: "18 Jan 2026, 09:00", imagePlaceholder: "bg-gradient-to-br from-green-100 to-emerald-100" },
  { id: "a3", title: "Reseña: cena de aniversario", platform: "Instagram", scheduledAt: "25 Jan 2026, 18:00", imagePlaceholder: "bg-gradient-to-br from-amber-50 to-yellow-100" },
];

const allScheduledPosts = [
  ...propuestasPendientes.map((p) => ({ ...p, type: "pendiente" as const })),
  ...proximasPropuestas.map((p) => ({ ...p, type: "proxima" as const, platform: "Instagram" })),
  ...propuestasAprobadas.map((p) => ({ ...p, type: "aprobada" as const })),
];

function buildPostsByDate() {
  const map: Record<string, typeof allScheduledPosts> = {};
  allScheduledPosts.forEach((post) => {
    const key = parseDateKey(post.scheduledAt);
    if (!map[key]) map[key] = [];
    map[key].push(post);
  });
  return map;
}
const postsByDate = buildPostsByDate();

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

const TYPE_STYLES = {
  pendiente: { label: "Pendiente de revisión", dot: "bg-red-400", border: "border-l-red-400", badge: "bg-red-100 text-red-800" },
  aprobada: { label: "Aprobada", dot: "bg-emerald-500", border: "border-l-emerald-500", badge: "bg-emerald-100 text-emerald-800" },
  proxima: { label: "Próxima propuesta", dot: "bg-slate-500", border: "border-l-slate-500", badge: "bg-slate-100 text-slate-800" },
} as const;

const VALID_FILTERS: PostFilter[] = ["pendientes", "proximas", "aprobadas"];

const CALENDAR_MONTHS = [
  { year: 2026, month: 0, title: "Enero 2026" },
  { year: 2026, month: 1, title: "Febrero 2026" },
  { year: 2026, month: 2, title: "Marzo 2026" },
];

const FILTER_TO_TYPE: Record<PostFilter, "pendiente" | "proxima" | "aprobada"> = {
  pendientes: "pendiente",
  proximas: "proxima",
  aprobadas: "aprobada",
};

function filterPostsByType(postsByDate: Record<string, typeof allScheduledPosts>, filter: PostFilter): Record<string, typeof allScheduledPosts> {
  const type = FILTER_TO_TYPE[filter];
  const result: Record<string, typeof allScheduledPosts> = {};
  Object.entries(postsByDate).forEach(([key, posts]) => {
    const filtered = posts.filter((p) => p.type === type);
    if (filtered.length > 0) result[key] = filtered;
  });
  return result;
}

function getTargetMonthForFilter(filter: PostFilter, filteredPostsByDate: Record<string, typeof allScheduledPosts>): { year: number; month: number } | null {
  const dateKeys = Object.keys(filteredPostsByDate);
  if (dateKeys.length === 0) return null;
  const sorted = dateKeys.sort();
  const targetKey = filter === "aprobadas" ? sorted[sorted.length - 1] : sorted[0];
  const [year, month] = targetKey.split("-").map(Number);
  return { year, month: month - 1 };
}

function PostsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const viewParam = searchParams.get("view");
  const initialFilter: PostFilter =
    filterParam && VALID_FILTERS.includes(filterParam as PostFilter)
      ? (filterParam as PostFilter)
      : viewParam === "calendar"
        ? "pendientes"
        : "proximas";
  const [filter, setFilter] = React.useState<PostFilter>(initialFilter);

  useEffect(() => {
    if (filterParam && VALID_FILTERS.includes(filterParam as PostFilter)) {
      setFilter(filterParam as PostFilter);
    } else if (viewParam === "calendar" && !filterParam) {
      setFilter("pendientes");
    }
  }, [filterParam, viewParam]);
  const initialView: "list" | "calendar" =
    viewParam === "calendar" ? "calendar" : "list";
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">(initialView);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  useEffect(() => {
    if (viewParam === "calendar" || viewParam === "list") {
      setViewMode(viewParam);
    }
  }, [viewParam]);

  const filteredPostsByDate = filterPostsByType(postsByDate, filter);
  const selectedDatePosts = selectedDate ? (filteredPostsByDate[selectedDate] ?? []) : [];
  const targetMonth = getTargetMonthForFilter(filter, filteredPostsByDate);
  const monthRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (viewMode === "calendar" && targetMonth) {
      const key = `${targetMonth.year}-${targetMonth.month}`;
      monthRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filter, viewMode, targetMonth?.year, targetMonth?.month]);

  const chatBg = "bg-[#FBFBF7]";

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`sticky top-0 z-30 ${chatBg} px-4 py-4 lg:px-8`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full text-black hover:bg-accent/20 transition-colors shrink-0" aria-label="Volver al inicio">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">Propuestas</h1>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Link
              href={`/posts?filter=${filter}&view=list`}
              className={cn("flex items-center justify-center w-9 h-9 rounded-full transition-colors", viewMode === "list" ? "bg-black text-white" : "text-foreground/70 hover:bg-accent/20")}
              aria-label="Vista lista"
            >
              <List className="h-5 w-5" />
            </Link>
            <Link
              href={`/posts?filter=${filter}&view=calendar`}
              className={cn("flex items-center justify-center w-9 h-9 rounded-full transition-colors", viewMode === "calendar" ? "bg-black text-white" : "text-foreground/70 hover:bg-accent/20")}
              aria-label="Vista calendario"
            >
              <CalendarDays className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className={`flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto w-full ${chatBg}`}>
        <div className="flex overflow-x-auto gap-2 mb-6 pb-1 -mx-1 px-1 overflow-y-hidden scrollbar-hide">
          <div className="flex gap-2 flex-nowrap min-w-0">
            <Link href={`/posts?filter=proximas&view=${viewMode}`} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0", filter === "proximas" ? "bg-black text-white" : "bg-white border border-border text-foreground hover:bg-accent/30")}>Próximas</Link>
            <Link href={`/posts?filter=pendientes&view=${viewMode}`} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0", filter === "pendientes" ? "bg-black text-white" : "bg-white border border-border text-foreground hover:bg-accent/30")}>Pendientes de aprobar</Link>
            <Link href={`/posts?filter=aprobadas&view=${viewMode}`} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0", filter === "aprobadas" ? "bg-black text-white" : "bg-white border border-border text-foreground hover:bg-accent/30")}>Aprobadas</Link>
          </div>
        </div>

        {viewMode === "list" && filter === "proximas" && (
          <MayaMessageBlock message={<>Si tienes alguna idea para el contenido del próximo mes, envíanos feedback; si no, el <strong>28 de febrero</strong> te mandaremos una propuesta basada en nuestro conocimiento de tu negocio.</>} />
        )}

        {viewMode === "list" && filter === "pendientes" && (
          <div className="flex flex-col gap-4">
            {propuestasPendientes.map((post) => (
              <button key={post.id} type="button" onClick={() => router.push(`/posts/${post.id}/preview?from=${filter}`)} className={`w-full text-left overflow-hidden rounded-xl ${chatBg} hover:shadow-md transition-shadow border border-[#C3C3C3]`}>
                <div className="p-0 flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-40 h-32 sm:h-auto sm:min-h-[120px] shrink-0 rounded-l-xl overflow-hidden">
                    {post.image ? (
                      <Image src={post.image} alt="" fill className="object-cover" sizes="160px" />
                    ) : (
                      <div className={cn("w-full h-full", post.imagePlaceholder)} />
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <p className="text-[15px] font-medium text-foreground line-clamp-2">{post.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[13px] text-foreground/70"><Instagram className="h-3.5 w-3.5" />{post.platform}</span>
                      <span className="inline-flex items-center gap-1 text-[13px] text-foreground/70"><Calendar className="h-3.5 w-3.5" />{post.scheduledAt}</span>
                    </div>
                    <span className="inline-flex self-start mt-2 px-2 py-0.5 rounded-full text-[13px] font-medium bg-red-100 text-red-800">Pendiente de revisión</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {viewMode === "list" && filter === "proximas" && (
          <div className="flex flex-col gap-4">
            {proximasPropuestas.map((post) => (
              <button key={post.id} type="button" onClick={() => router.push("/posts/nueva")} className={`w-full text-left overflow-hidden rounded-xl ${chatBg} hover:shadow-md transition-shadow border border-[#C3C3C3]`}>
                <div className="p-0 flex flex-col sm:flex-row">
                  <div className={cn("w-full sm:w-40 h-32 sm:h-auto sm:min-h-[120px] shrink-0 rounded-l-xl", post.imagePlaceholder)} />
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0 gap-3">
                    <div>
                      <p className="text-[15px] font-medium text-foreground">{post.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[13px] text-foreground/70"><Calendar className="h-3.5 w-3.5" />Publicación propuesta: {post.scheduledAt}</span>
                      </div>
                    </div>
                    <span className="inline-flex self-start items-center justify-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-black text-white hover:bg-black/90 transition-colors">
                      Añadir imagen y contexto
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {viewMode === "list" && filter === "aprobadas" && (
          <div className="flex flex-col gap-4">
            {propuestasAprobadas.map((post) => (
              <button key={post.id} type="button" onClick={() => {}} className={`w-full text-left overflow-hidden rounded-xl ${chatBg} hover:shadow-md transition-shadow border border-[#C3C3C3]`}>
                <div className="p-0 flex flex-col sm:flex-row">
                  <div className={cn("w-full sm:w-40 h-32 sm:h-auto sm:min-h-[120px] shrink-0 rounded-l-xl", post.imagePlaceholder)} />
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <p className="text-[15px] font-medium text-foreground line-clamp-2">{post.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[13px] text-foreground/70"><Instagram className="h-3.5 w-3.5" />{post.platform}</span>
                      <span className="inline-flex items-center gap-1 text-[13px] text-foreground/70"><Calendar className="h-3.5 w-3.5" />{post.scheduledAt}</span>
                    </div>
                    <span className="inline-flex self-start mt-2 px-2 py-0.5 rounded-full text-[13px] font-medium bg-primary/20 text-primary">Aprobada</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {viewMode === "calendar" && (
          <div className="space-y-6">
            {CALENDAR_MONTHS.map(({ year, month, title }) => (
              <div
                key={`${year}-${month}`}
                ref={(el) => { monthRefs.current[`${year}-${month}`] = el; }}
                className="rounded-xl border border-[#C3C3C3] bg-white overflow-hidden"
              >
                <p className="text-sm font-medium text-foreground px-3 py-2 border-b border-border">{title}</p>
                <div className="grid grid-cols-7 text-center text-xs font-medium text-foreground/70 border-b border-border">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="py-2">{d}</div>
                  ))}
                </div>
                <CalendarGrid year={year} month={month} postsByDate={filteredPostsByDate} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              </div>
            ))}
            {selectedDate && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Programación {selectedDate}</p>
                <div className="flex flex-col gap-2">
                  {selectedDatePosts.map((post) => {
                    const style = TYPE_STYLES[post.type];
                    return (
                      <div key={post.id} className={cn("rounded-lg border border-[#C3C3C3] border-l-4 bg-white p-3 text-left", style.border)}>
                        <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1.5", style.badge)}>{style.label}</span>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{post.title}</p>
                        <p className="text-xs text-foreground/70 mt-0.5">{post.scheduledAt}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#FBFBF7]">Cargando...</div>}>
      <PostsPageContent />
    </Suspense>
  );
}

function CalendarGrid({ year, month, postsByDate, selectedDate, onSelectDate }: { year: number; month: number; postsByDate: Record<string, typeof allScheduledPosts>; selectedDate: string | null; onSelectDate: (date: string) => void }) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();
  const cells: (number | null)[] = [...Array.from({ length: startOffset }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateKey = (day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

  return (
    <div className="grid grid-cols-7">
      {cells.map((day, i) => {
        if (day === null) return <div key={`empty-${i}`} className="min-h-[44px] aspect-square" />;
        const key = dateKey(day);
        const dayPosts = postsByDate[key] ?? [];
        const hasPosts = dayPosts.length > 0;
        const imagePost = dayPosts.find((p) => p.type === "pendiente" || p.type === "aprobada");
        const hasProximas = dayPosts.some((p) => p.type === "proxima");
        const showImage = !!imagePost;
        const showGreen = hasProximas && !showImage;
        const isSelected = selectedDate === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectDate(key)}
            className={cn(
              "min-h-[44px] aspect-square flex items-center justify-center text-sm transition-colors rounded-lg overflow-hidden",
              isSelected && "ring-2 ring-black ring-offset-1",
              showGreen && !isSelected && "bg-[#BEFF50]",
            )}
          >
            {showImage && !isSelected ? (
              <div className="relative w-full h-full min-h-[44px]">
                {"image" in imagePost && imagePost.image ? (
                  <Image src={imagePost.image} alt="" fill className="object-cover" sizes="80px" />
                ) : (
                  <div className={cn("absolute inset-0", imagePost.imagePlaceholder)} />
                )}
                <span className="absolute bottom-0.5 right-0.5 px-1 rounded text-[10px] font-semibold bg-black/60 text-white leading-tight">
                  {day}
                </span>
              </div>
            ) : (
              <span
                className={cn(
                  "flex items-center justify-center w-full h-full min-h-[44px] rounded-lg",
                  isSelected ? "bg-black text-white font-medium" : "text-foreground hover:bg-accent/20",
                  hasPosts && !isSelected && !showGreen && "font-medium",
                )}
              >
                {day}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
