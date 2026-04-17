import "./globals.css";
import type { ReactNode } from "react";
import AccountProvider from "./components/AccountProvider";
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
        <AccountProvider>
          <GlobalMouseTrail />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
        </AccountProvider>
      </body>
    </html>
  );
}
