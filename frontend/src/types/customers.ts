export type Customer = {
    id: number;
    customerNo: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

export type PageRespons<T> = {
    content: T[];
    TotalElements: number;
    totalPages: number;
    size: number;
    first: boolean;
    last: boolean;
}