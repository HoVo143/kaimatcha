// Dùng globalThis để giữ OTP trong suốt vòng đời app (Next.js hot reload vẫn giữ được)
if (!(globalThis as any)._otpStore) {
  (globalThis as any)._otpStore = new Map<string, { code: string; expires: number }>();
}
export const otpStore = (globalThis as any)._otpStore as Map<
  string,
  { code: string; expires: number }
>;
