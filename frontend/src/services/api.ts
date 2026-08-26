import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await API.get<Transaction[]>("/transactions");
  return response.data;
};

export const getTransaction = async (
  id: string
): Promise<Transaction> => {
  const response = await API.get<Transaction>(`/transactions/${id}`);
  return response.data;
};

export default API;