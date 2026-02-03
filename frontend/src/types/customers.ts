export type Customer = {
    id: number;
    customerNo: number;
    companyName: string;
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