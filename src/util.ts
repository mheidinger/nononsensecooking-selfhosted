export function convertErrorsToMessage(
  validationErrors: unknown,
): string | undefined {
  const errors: string[] = [];

  function traverse(obj: unknown, path: string[] = []): void {
    if (typeof obj !== "object" || obj === null) {
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (key === "_errors" && Array.isArray(value)) {
        value.forEach((error) => {
          if (typeof error === "string") {
            errors.push(`${path.join(".")}: ${error}`);
          }
        });
      } else if (typeof value === "object" && value !== null) {
        traverse(value, [...path, key]);
      }
    }
  }

  traverse(validationErrors);

  if (errors.length === 0) {
    return;
  }

  return errors.join("\n");
}
