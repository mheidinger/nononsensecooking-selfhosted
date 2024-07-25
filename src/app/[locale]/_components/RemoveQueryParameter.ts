"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePathname, useRouter } from "~/navigation";

interface Props {
  parameter: string;
}

export default function RemoveQueryParameter({ parameter }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const cacheParam = searchParams.get(parameter);

    if (cacheParam !== null) {
      // Create a new URLSearchParams object
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Remove the 'cache' parameter
      newSearchParams.delete(parameter);

      // Convert the remaining parameters back to a string
      const newQueryString = newSearchParams.toString();

      // Construct the new URL
      const newPathname = newQueryString
        ? `${pathname}?${newQueryString}`
        : pathname;

      // Update the URL without triggering a full page reload
      router.replace(newPathname, { scroll: false });
    }
  }, [parameter, pathname, router, searchParams]);

  return null; // This component doesn't render anything
}
