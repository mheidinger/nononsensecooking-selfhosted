"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "~/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {t("title")}
      <Link href={pathname} locale="de">
        de
      </Link>
      <Link href={pathname} locale="en">
        en
      </Link>
    </main>
  );
}
