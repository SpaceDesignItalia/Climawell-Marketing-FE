import { Button } from "@heroui/react";

export default function Error404() {
  return (
    <div className="lg:ml-72 min-h-screen bg-white">
      {" "}
      <main className="relative isolate h-screen">
        <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
          <p className="text-base/8 font-semibold text-black">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-black sm:text-7xl">
            Pagina non trovata
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-black/70 sm:text-xl/8">
            Non abbiamo trovato la pagina che stavi cercando.
          </p>
          <div className="mt-10 flex justify-center">
            <Button as="a" size="lg" color="primary" href="/">
              <span aria-hidden="true">&larr;</span> Torna alla home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
