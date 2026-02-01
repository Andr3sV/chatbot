"use client";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center border-l border-border bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <svg
            className="h-16 w-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Selecciona una conversación
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Elige un chat de la lista para comenzar
          </p>
        </div>
      </div>
    </section>
  );
}
