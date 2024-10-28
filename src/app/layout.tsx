import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import MuiProvider from "./MuiProvider";

export const metadata: Metadata = {
  title: "Forte Global",
  description: "Forte Global",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
      <head></head>
      <body>
        <MuiProvider>
          <StoreProvider>
            <div>
              <div className="bg-body-gradient w-screen h-screen fixed top-0 left-0 z-[-1]"></div>
              <div className="min-h-screen w-screen overflow-hidden">
                {children}
              </div>
            </div>
          </StoreProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
