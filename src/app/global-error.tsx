"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
}

export default function GlobalError({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <h1>Sorry, something went wrong!</h1>
      </body>
    </html>
  );
}
