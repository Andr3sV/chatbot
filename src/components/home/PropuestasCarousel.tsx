"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Calendar } from "lucide-react";
import { propuestasPendientes } from "@/lib/mock-posts";
import { cn } from "@/lib/utils";

const chatBg = "bg-[hsl(var(--chat-background))]";

export function PropuestasCarousel() {
  return (
    <section className="mb-8 rounded-xl border border-border bg-[#FBFBF7] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">
          Mis propuestas
        </h2>
        <Link
          href={propuestasPendientes.length > 0 ? "/posts?filter=pendientes" : "/posts?filter=proximas"}
          className="text-sm font-medium text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors shrink-0"
        >
          Ver todo
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {propuestasPendientes.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}/preview`}
            className={cn(
              "flex-shrink-0 w-[280px] text-left overflow-hidden rounded-xl",
              "hover:shadow-md transition-shadow border border-[#C3C3C3]",
              chatBg
            )}
          >
            <div className="flex flex-col">
              <div className="relative w-full h-32 shrink-0 rounded-t-xl overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                ) : (
                  <div className={cn("w-full h-full", post.imagePlaceholder)} />
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {post.title}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/70">
                    <Instagram className="h-3.5 w-3.5" />
                    {post.platform}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/70">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.scheduledAt}
                  </span>
                </div>
                <span className="inline-flex self-start px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Pendiente de revisión
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
