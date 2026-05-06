import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mishaye Pupil Society",
  description: "To Serve The Needy. Real-time society web app for members, volunteers, and the public.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="fixed-background-system">
          <div className="mesh-layer"></div>
          <div className="logo-watermark"></div>
        </div>
        <Providers>
          <Navbar />
          <div className="content-wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
