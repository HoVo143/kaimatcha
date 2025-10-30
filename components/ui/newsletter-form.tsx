"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-neutral-400 focus:outline-none py-1 pr-8 text-sm placeholder-neutral-600 bg-transparent"
          required
        />
        <button
          type="submit"
          className="absolute right-0 top-0 text-neutral-600 hover:text-black"
        >
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
        {status === "success" && <p className="text-emerald-700 mt-2 text-sm">Thank you for subscribing!</p>}
        {status === "error" && <p className="text-red-600 mt-2 text-sm">Something went wrong.</p>}
      </div>
    </form>
  );
}
