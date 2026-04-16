export function formatDateTime(value: string | null) {
  if (!value) {
    return "Ikke registrert";
  }

  return new Date(value).toLocaleString("no-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Ikke registrert";
  }

  return new Date(value).toLocaleDateString("no-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
