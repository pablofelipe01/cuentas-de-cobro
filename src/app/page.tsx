'use client';

import SignatureForm from '@/components/form/SignatureFormProps';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 items-center w-full">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-8 text-gray-200">
            Bienvenidos a Sirius Regenerative
          </h1>
          
          {/* El contenedor del formulario mantiene el estilo pero ya no pasamos props */}
          <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl">
            <SignatureForm />
          </div>
        </main>

        <footer className="row-start-3 text-center text-sm text-gray-400">
          © 2024 Sirius Regenerative
        </footer>
      </div>
    </div>
  );
}