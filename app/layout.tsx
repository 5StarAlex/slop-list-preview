import "./globals.css";
import type { ReactNode } from "react";
import GlobalMouseTrail from "./components/GlobalMouseTrail";
import PageTransition from "./components/PageTransition";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalMouseTrail />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
