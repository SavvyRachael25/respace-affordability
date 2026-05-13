import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Could You Afford as a reSpace Co-Owner?",
  description:
    "See the gap between solo and co-homeownership affordability. Real numbers, real possibilities, in your metro.",
  openGraph: {
    title: "What Could You Afford as a reSpace Co-Owner?",
    description:
      "See the gap between solo and co-homeownership affordability. Real numbers, real possibilities, in your metro.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#1A1F2E",
          color: "#F5F1EA",
          fontFamily:
            "'DM Sans', system-ui, -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
