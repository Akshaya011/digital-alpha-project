import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export interface Transaction {
  id: string;
  timestamp: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  total_pages: number;
}

export interface PaymentResponse {
  payment_id: string;
  amount: number;
  status: "PAID";
  paid_at: string;
}

export const getTransactions = async (
  page = 1,
  search = ""
): Promise<TransactionsResponse> => {
  const response = await API.get<TransactionsResponse>("/transactions", {
    params: { page, search },
  });
  return response.data;
};

export const getTransaction = async (
  id: string
): Promise<Transaction> => {
  const response = await API.get<Transaction>(`/transactions/${id}`);
  return response.data;
};

export const payBill = async (): Promise<PaymentResponse> => {
  const response = await API.post<PaymentResponse>("/bill/pay");
  return response.data;
};

export default API;