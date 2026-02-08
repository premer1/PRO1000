export type PageResponse<T> = {
    content: T[];
    page: {
        totalElements: number;
        totalPages: number;
        size: number;
        number: number; // current page
        first: boolean;
        last: boolean;
    }
};

export type TicketsType = {
    id: number;
    ticketNo: number;
    companyName: string;
    email: string;
    description: string;
    phone: string;
    created: string;
    updatedLast?: string;
}
