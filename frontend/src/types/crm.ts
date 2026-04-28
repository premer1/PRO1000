export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};

export type Customer = {
  id: number;
  customerNo: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Ticket = {
  id: number;
  ticketNo: number;
  subject: string;
  description: string;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  customerId: number | null;
  customerName: string | null;
  created: string;
  updatedLast: string;
  closedAt: string | null;
};

export type Note = {
  id: number;
  text: string;
  createdAt: string;
  createdBy: string;
};

export type DashboardRecentTicket = {
  id: number;
  ticketNo: number;
  subject: string;
  companyName: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedLast: string;
};

export type DashboardCustomerActivity = {
  id: number;
  companyName: string;
  contactName: string;
  updatedAt: string;
  activeTickets: number;
  totalTickets: number;
};

export type DashboardResponse = {
  totalCustomers: number;
  activeCustomers: number;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  waitingTickets: number;
  closedTickets: number;
  recentTickets: DashboardRecentTicket[];
  recentCustomerActivity: DashboardCustomerActivity[];
};

export type TicketAssistant = {
  summary: string;
  suggestedPriority: TicketPriority;
  suggestedCategory: string;
  suggestedReply: string;
  provider: string;
  fallbackUsed: boolean;
};
