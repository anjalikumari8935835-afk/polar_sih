import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import ThemeProvider from "../src/components/ThemeProvider";
import AIResearchAssistant from "../src/components/AIResearchAssistant";

export const metadata: Metadata = {
  title: "Polar Science Portal",
  description:
    "Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AIResearchAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}