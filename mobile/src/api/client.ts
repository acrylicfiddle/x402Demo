import axios from 'axios';

// In a real app this would use x402-fetch/axios with wallet signing.
// For demo purposes, we simulate the x402 payment flow.
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4021';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Simulate x402 payment header for demo purposes
// In production, this would use the x402 client library with a real wallet
export async function getWithPayment<T>(path: string, walletKey?: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(path);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 402) {
      // x402 flow: server returned payment required
      // In a real implementation, we'd use x402-fetch to automatically pay
      // For this demo, we include a mock payment header
      const paymentInfo = error.response.data;
      console.log('x402 Payment Required:', paymentInfo);

      if (walletKey) {
        // Simulate paying: in production this signs a USDC transfer
        const mockPaymentHeader = Buffer.from(JSON.stringify({
          scheme: 'exact',
          network: 'base-sepolia',
          payload: { mock: true, walletKey: walletKey.slice(0, 6) + '...' }
        })).toString('base64');

        const paidResponse = await apiClient.get<T>(path, {
          headers: { 'X-PAYMENT': mockPaymentHeader }
        });
        return paidResponse.data;
      }

      throw new Error('Payment required. Please configure your wallet in Settings.');
    }
    throw error;
  }
}

export async function getPlans() {
  const response = await apiClient.get('/api/plans');
  return response.data.plans;
}

export async function getPlanDetail(planId: string, walletKey?: string) {
  return getWithPayment<{ plan: any }>(`/api/plans/${planId}`, walletKey);
}

export async function getWorkout(workoutId: string, walletKey?: string) {
  return getWithPayment<{ workout: any; planId: string; planName: string }>(`/api/workouts/${workoutId}`, walletKey);
}
