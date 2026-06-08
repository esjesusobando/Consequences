import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Sofía Mayen",
    default: "Sofía Mayen — Product Designer & Creative Director",
  },
  description: "Product designer specializing in brand identity, UI/UX systems and creative direction. Based in Atlanta, GA.",
  keywords: ["product designer", "UI/UX", "brand identity", "creative director", "Atlanta"],
  authors: [{ name: "Sofía Mayen" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}