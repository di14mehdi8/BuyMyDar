import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BuyMyDar",
  description: "Comparateur de crédits immobiliers au Maroc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
