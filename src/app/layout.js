import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: { default: "JayQ — Clear assessments. Confident progress.", template: "%s | JayQ" },
  description: "JayQ helps schools create timed assessments, guide students, and share results with confidence.",
};

export default function RootLayout({ children }) {
  return <html lang="en" className={manrope.variable}><body>{children}</body></html>;
}
