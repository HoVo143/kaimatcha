"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState("");

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Code sent! Check your email.");
      setStep("code");
    } else {
      setMessage(data.message || "Failed to send code.");
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={step === "email" ? sendCode : verifyCode}
        className="bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {step === "email" ? "Login" : "Enter Code"}
        </h1>

        {step === "email" ? (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full mb-3 px-3 py-2 rounded focus:outline-none"
          />
        ) : (
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border w-full mb-3 px-3 py-2 rounded focus:outline-none"
          />
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {step === "email" ? "Send Code" : "Verify"}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
