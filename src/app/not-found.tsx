import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <main className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-blue-deep/10 bg-white/78 p-8 text-center shadow-soft">
        <p className="text-sm font-bold uppercase text-gold-soft">Piano Claro</p>
        <h1 className="mt-3 text-4xl font-bold text-blue-deep">No encontramos esa página</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          La ruta puede no existir todavía dentro del MVP conceptual.
        </p>
        <ButtonLink href="/rutas" className="mt-7">
          Volver a rutas
        </ButtonLink>
      </div>
    </main>
  );
}
