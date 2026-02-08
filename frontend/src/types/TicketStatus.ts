export const STATUS_LABEL: Record<string, string> = {
    OPEN: "Åpen",
    IN_PROGRESS: "Pågår",
    WAITING: "Venter",
    CLOSED: "Lukket",
};

export function statusLabel(status?: string) {
    return STATUS_LABEL[status ?? "OPEN"] ?? status ?? "Ukjent";
}
