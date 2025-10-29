"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      reason: (form.elements.namedItem("reason") as HTMLSelectElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };


    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason *</label>
        <select
          id="reason"
          name="reason"
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Please select</option>
          <option value="Order status">Order status</option>
          <option value="Report an issue">Report an issue</option>
          <option value="Product question">Product question</option>
          <option value="Wholesale">Wholesale</option>
          <option value="Collaboration">Collaboration</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-800 text-white px-6 py-3 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>

      {status === "success" && (
        <p className="text-green-600 mt-2 text-center">Message sent successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-2 text-center">Something went wrong. Please try again later.</p>
      )}
    </form>
  );
}
