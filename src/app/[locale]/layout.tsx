import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import ServiceWorkerRegistration from "~/app/_components/ServiceWorkerRegistration";
import { routing } from "~/i18n/routing";
import Footer from "~components/Footer";
import Header from "~components/Header";
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={styles.body}>
        <NextIntlClientProvider messages={messages}>
          <ServiceWorkerRegistration />
          <main className={styles.layout}>
            <NextTopLoader color="#5686F5" height={5} showSpinner={false} />
            <Header />
            <div className={styles.content}>{children}</div>
            <Footer />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
