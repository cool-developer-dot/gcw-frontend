import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Har request mein token add karo
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('gwc_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const login = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);

// User
export const getProfile = () => API.get('/user/profile');
export const getWallet = () => API.get('/user/wallet');

// Staking
export const getPlans = () => API.get('/staking/plans');
export const createStake = (data) => API.post('/staking/stake', data);
export const getMyStakes = () => API.get('/staking/my-stakes');

// Finance
export const submitDeposit = (data) => API.post('/deposit/manual', data);
export const getDepositHistory = () => API.get('/deposit/history');
export const requestWithdrawal = (data) => API.post('/withdrawal/request', data);
export const getWithdrawalHistory = () => API.get('/withdrawal/history');

// Referral
export const getReferralStats = () => API.get('/referral/stats');
export const getTeam = () => API.get('/referral/team');

export default API;