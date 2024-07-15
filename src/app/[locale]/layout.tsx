import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

import styles from "./layout.module.css";

export const viewport: Viewport = {
  themeColor: "#5686f5",
};

export const metadata: Metadata = {
  title: "NoNonsenseCooking",
  icons: {
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5686f5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#5686f5",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={styles.body}>
        <NextIntlClientProvider messages={messages}>
          <main className={styles.layout}>
            <Header />
            <div className={styles.content}>{children}</div>
            <Footer />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
