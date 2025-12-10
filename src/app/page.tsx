import { BriefingForm } from '@/components/briefing-form';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="w-full max-w-3xl mx-auto py-8">
        <header className="flex justify-center mb-10">
          <Image
            src="https://www.agencianotavel.com.br/wp-content/uploads/2024/10/notavel-logo.webp"
            alt="Notável Logo"
            width={200}
            height={50}
            priority
            className="h-auto"
          />
        </header>
        <BriefingForm />
      </div>
    </main>
  );
}
