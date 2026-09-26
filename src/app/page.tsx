import Image from 'next/image';
import { ConverterApp } from '@/components/converter/converter-app';
import { AuthButton } from '@/components/auth/auth-button';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl py-8">
        <header className="mb-8 flex flex-col items-center gap-4 rounded-xl bg-gray-800 p-6">
          <div className="flex w-full items-center justify-between">
            <Image
              src="https://www.agencianotavel.com.br/wp-content/uploads/2024/10/notavel-logo.webp"
              alt="Notável Logo"
              width={140}
              height={35}
              priority
              className="h-auto"
            />
            <AuthButton />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Conversor de Etiquetas</h1>
            <p className="mt-1 text-sm text-gray-300">
              Shopee, Mercado Livre e TikTok Shop em PDF pronto pra impressora térmica 10×15cm
            </p>
          </div>
        </header>

        <ConverterApp />
      </div>
    </main>
  );
}
