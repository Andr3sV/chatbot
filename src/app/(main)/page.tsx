import Link from "next/link";
import { Bell, FileText, ArrowUpRight, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[hsl(var(--sidebar-background))]">
      {/* Header */}
      <header className="bg-accent/90 text-accent-foreground px-4 py-4 lg:px-8 rounded-b-2xl lg:rounded-b-none">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-primary font-bold text-sm">
              PT
            </div>
            <span className="font-semibold text-lg">Plinng</span>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-primary relative"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-6xl mx-auto w-full">
        {/* Sophia WhatsApp - Conversaciones */}
        <section className="space-y-3 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <MessageCircle className="h-5 w-5 text-primary" />
              Sophia WhatsApp
            </h2>
            <Link
              href="/conversaciones"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              aria-label="Ver conversaciones"
            >
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
          <Link href="/conversaciones" className="block group">
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200",
                "hover:shadow-md hover:border-primary/30 hover:ring-2 hover:ring-primary/10",
                "active:scale-[0.99]"
              )}
            >
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Gestiona tus conversaciones
                </h3>
                <p className="text-sm text-foreground/70">
                  WhatsApp, Instagram, Google y llamadas con ayuda de Sophia
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  Ver conversaciones
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Banner de novedades */}
        <Card className="mb-6 border-0 bg-accent/30 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary text-xl">✓</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Tus últimas novedades
              </p>
              <p className="text-sm text-foreground/80">
                El agente IA ha generado 3 nuevas propuestas de contenido para esta semana.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mis propuestas → lista de posts */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Mis propuestas
            </h2>
            <Link
              href="/posts"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              aria-label="Ver todos los posts"
            >
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          <Link href="/posts" className="block group">
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200",
                "hover:shadow-md hover:border-primary/30 hover:ring-2 hover:ring-primary/10",
                "active:scale-[0.99]"
              )}
            >
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Posts programados
                </h3>
                <p className="text-sm text-foreground/70">
                  Ver y gestionar el contenido que se publicará en redes sociales
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  Ver lista de posts
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Reputación */}
        <section className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <span className="text-primary">★</span>
              Reputación
            </h2>
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              aria-label="Ver reputación"
            >
              <ArrowUpRight className="h-5 w-5" />
            </button>
          </div>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="text-2xl font-bold text-primary">—</div>
              <div>
                <p className="font-medium text-foreground">Tu sector</p>
                <p className="text-sm text-foreground/70">
                  Conecta tu negocio para ver métricas de reputación
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
