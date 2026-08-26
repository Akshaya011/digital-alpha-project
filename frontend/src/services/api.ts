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

interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  total_pages: number;
}

export const getTransactions = async (
  page = 1,
  search = "",
  category = "",
  status = "",
  payment_method = ""
): Promise<TransactionResponse> => {
  const response = await API.get<TransactionResponse>("/transactions", {
    params: {
      page,
      search,
      category,
      status,
      payment_method,
    },
  });

  return response.data;
};

export const getTransaction = async (
  id: string
): Promise<Transaction> => {
  const response = await API.get<Transaction>(
    `/transactions/${id}`
  );

  return response.data;
};

export default API;