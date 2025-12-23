import type { Metadata } from "next";
import { Inter, Lora, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Configuring fonts locally just in case, but globals.css imports them too. 
// Ideally we stick to one method. Since globals.css has @import, we can rely on that or use Next.js font optimization.
// Using class mapping to match Tailwind config if needed, but globals.css handles simple font-family declarations.
// Let's keep it simple and just use Providers + CSS.

export const metadata: Metadata = {
  title: "Dashboard Executivo | Projetos Click e Atenda",
  description: "Dashboard executivo para visualização macro e micro dos projetos Click e Atenda, com integração Notion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
