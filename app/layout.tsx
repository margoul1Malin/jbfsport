import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "JBF Sport - Matériel Sportif Professionnel",
  description: "JBF Sport, votre partenaire pour l'équipement sportif professionnel. Découvrez notre sélection de matériel de qualité pour tous vos besoins sportifs.",
  keywords: "sport, matériel sportif, équipement, JBF Sport, Casal Sport",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
