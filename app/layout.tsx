import "./globals.css";
import type { ReactNode } from "react";
import GlobalMouseTrail from "./components/GlobalMouseTrail";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalMouseTrail />
        <main>{children}</main>
      </body>
    </html>
  );
}
