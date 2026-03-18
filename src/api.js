import axios from "axios";

// Configure API base URL via env for Vercel/production.
// Example: REACT_APP_API_URL="https://your-backend.example.com/api"
const API_BASE_URL =
  process.env.REACT_APP_API_URL?.trim() || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Server origin without trailing "/api" (useful for file URLs like "/uploads/...").
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Har request mein token add karo
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("gwc_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Token expire ho jaye to login page pe bhejo
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("gwc_token");
      localStorage.removeItem("gwc_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// ── Auth ─────────────────────────────────────────
export const register = (data) => API.post("/auth/register", data);
export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const login = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);

// ── User ─────────────────────────────────────────
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) => API.put("/user/profile", data);
export const getWallet = () => API.get("/user/wallet");
export const changePassword = (data) => API.put("/user/change-password", data);

// ── Staking ──────────────────────────────────────
export const getPlans = () => API.get("/staking/plans");
export const createStake = (data) => API.post("/staking/stake", data);
export const getMyStakes = () => API.get("/staking/my-stakes");
export const unstake = (stakeId) => API.post(`/staking/unstake/${stakeId}`);

// ── Deposit ──────────────────────────────────────
export const submitDeposit = (formData) =>
  API.post("/deposit/manual", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getDepositHistory = () => API.get("/deposit/history");

// ── Withdrawal ───────────────────────────────────
export const requestWithdrawal = (data) =>
  API.post("/withdrawal/request", data);
export const getWithdrawalHistory = () => API.get("/withdrawal/history");

// ── Referral ─────────────────────────────────────
export const getReferralStats = () => API.get("/referral/stats");
export const getTeam = () => API.get("/referral/team");

// ── Transactions ─────────────────────────────────
export const getTransactionHistory = (params) =>
  API.get("/transaction/history", { params });

// ── Admin ────────────────────────────────────────
export const adminGetStats = () => API.get("/admin/stats");
export const adminGetUsers = () => API.get("/admin/users");
export const adminGetDeposits = () => API.get("/admin/deposits");
export const adminApproveDeposit = (id) =>
  API.put(`/admin/deposits/${id}/approve`);
export const adminRejectDeposit = (id) =>
  API.put(`/admin/deposits/${id}/reject`);
export const adminGetWithdrawals = () => API.get("/admin/withdrawals");
export const adminApproveWithdrawal = (id) =>
  API.put(`/admin/withdrawals/${id}/approve`);
export const adminRejectWithdrawal = (id) =>
  API.put(`/admin/withdrawals/${id}/reject`);
export const adminDistributeRewards = () =>
  API.post("/admin/distribute-rewards");
export const adminGetLevelCommissions = () =>
  API.get("/admin/level-commissions");
export const adminSaveLevelCommissions = (data) =>
  API.post("/admin/level-commissions", data);
export const getTodayStats = () => API.get("/user/today-stats");
export default API;
