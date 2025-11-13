import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, reason, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Nội dung HTML có UI dạng bảng đẹp
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #006241; color: white; padding: 16px 24px; font-size: 20px; font-weight: bold;">
            🌿 New Contact from Kai Matcha Website
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 0;">
            <tr>
              <td style="padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold; width: 30%;">Name</td>
              <td style="padding: 12px 20px; border-bottom: 1px solid #e9ecef;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Email</td>
              <td style="padding: 12px 20px; border-bottom: 1px solid #e9ecef;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 20px; border-bottom: 1px solid #e9ecef; font-weight: bold;">Reason</td>
              <td style="padding: 12px 20px; border-bottom: 1px solid #e9ecef;">${reason}</td>
            </tr>
            <tr>
              <td style="padding: 12px 20px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 12px 20px; white-space: pre-line;">${message}</td>
            </tr>
          </table>
          <div style="padding: 16px 24px; background-color: #f1f3f5; font-size: 12px; color: #555;">
            This message was sent from <a href="https://kaimatcha.co" style="color: #006241; text-decoration: none;">KaiMatcha.co</a>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "congho110201@gmail.com",
      subject: `New Contact from ${name} (${reason})`,
      text: `
      Name: ${name}
      Email: ${email}
      Reason: ${reason}
      Message: ${message}
      `,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send mail", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 },
    );
  }
}
