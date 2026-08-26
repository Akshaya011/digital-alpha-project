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

export interface TransactionQuery {
  category?: string;
  status?: string;
  payment_method?: string;
  sort?: string;
  direction?: "asc" | "desc";
}

export interface PaymentResponse {
  payment_id: string;
  amount: number;
  status: "PAID";
  paid_at: string;
}

export interface CategorySpending {
  category: string;
  amount: number;
}

export interface RewardOption {
  name: string;
  coins: number;
}

export interface RewardsResponse {
  balance: number;
  rewards: RewardOption[];
}

export interface RedemptionResponse {
  redemption_id: number;
  reward_name: string;
  coins: number;
  balance: number;
  redeemed_at: string;
}

export const getTransactions = async (
  page = 1,
  search = "",
  filters: TransactionQuery = {}
): Promise<TransactionsResponse> => {
  const response = await API.get<TransactionsResponse>("/transactions", {
    params: { page, search, ...filters },
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

export const getCategorySpending = async (): Promise<CategorySpending[]> => {
  const response = await API.get<CategorySpending[]>("/analytics/categories");
  return response.data;
};

export const getRewards = async (): Promise<RewardsResponse> => {
  const response = await API.get<RewardsResponse>("/rewards");
  return response.data;
};

export const redeemReward = async (
  reward_name: string
): Promise<RedemptionResponse> => {
  const response = await API.post<RedemptionResponse>("/rewards/redeem", {
    reward_name,
  });
  return response.data;
};

export default API;