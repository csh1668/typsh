import { BackgroundGlow } from "@/components/background-glow";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundGlow />
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
