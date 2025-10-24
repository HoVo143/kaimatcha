import { otpStore } from "@/lib/otpStore";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email, { code, expires: Date.now() + 5 * 60 * 1000 }); // 5 phút

  // Gửi mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Kai Matcha login code",
    text: `Your login code is ${code}`,
  });

  return NextResponse.json({ message: "Code sent" });
}
