import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 3, 15 * 60 * 1000); // 3 requests per 15 minutes

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          resetTime: rateLimitResult.resetTime,
        },
        { status: 429 },
      );
    }

    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Enhanced validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 },
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 2000 characters" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Basic spam detection
    const spamKeywords = [
      "viagra",
      "casino",
      "lottery",
      "winner",
      "congratulations",
      "click here",
      "free money",
    ];
    const messageText = message.toLowerCase();
    const hasSpam = spamKeywords.some((keyword) =>
      messageText.includes(keyword)
    );

    if (hasSpam) {
      return NextResponse.json(
        { error: "Message contains prohibited content" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().replace(/[<>]/g, "");
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = message.trim().replace(/[<>]/g, "");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      debug: process.env.NODE_ENV === "development", // Enable debug in development
      logger: process.env.NODE_ENV === "development", // Enable logging in development
    });

    // Verify transporter
    await transporter.verify();

    // Email to you (the website owner)
    const mailOptionsToOwner = {
      from: `"Portfolio Contact" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      replyTo: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #667eea;
                display: block;
                margin-bottom: 5px;
              }
              .value {
                padding: 10px;
                background-color: #f5f5f5;
                border-left: 3px solid #667eea;
                border-radius: 5px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">👤 Name:</span>
                  <div class="value">${sanitizedName}</div>
                </div>
                <div class="field">
                  <span class="label">📧 Email:</span>
                  <div class="value">${sanitizedEmail}</div>
                </div>
                <div class="field">
                  <span class="label">💬 Message:</span>
                  <div class="value">${
        sanitizedMessage.replace(/\n/g, "<br>")
      }</div>
                </div>
                <div class="field">
                  <span class="label">🕒 Received:</span>
                  <div class="value">${new Date().toLocaleString()}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from your portfolio contact form</p>
                <p>Reply directly to this email to respond to ${sanitizedName}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${sanitizedName}
Email: ${sanitizedEmail}
Received: ${new Date().toLocaleString()}

Message:
${sanitizedMessage}

---
Reply to this email to respond to ${sanitizedName}
      `,
    };

    // Auto-reply email to the sender
    const mailOptionsToSender = {
      from: `"Bishnu BK" <${process.env.SMTP_EMAIL}>`,
      to: sanitizedEmail,
      subject: "Thank you for contacting me! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #666;
                font-size: 12px;
              }
              .message-preview {
                padding: 15px;
                background-color: #f5f5f5;
                border-left: 3px solid #667eea;
                border-radius: 5px;
                margin: 15px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Thank You for Reaching Out!</h1>
              </div>
              <div class="content">
                <p>Hi ${sanitizedName},</p>
                <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <div class="message-preview">
                  ${sanitizedMessage.replace(/\n/g, "<br>")}
                </div>
                <p>I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out to me directly at ${process.env.SMTP_EMAIL}.</p>
                <p>In the meantime, feel free to explore my portfolio and check out my latest projects!</p>
                <div style="text-align: center;">
                  <a href="${
        process.env.NEXT_PUBLIC_SITE_URL || "https://yourwebsite.com"
      }" class="button">Visit My Portfolio</a>
                </div>
              </div>
              <div class="footer">
                <p>Best regards,<br><strong>Bishnu BK</strong></p>
                <p>Full Stack Developer</p>
                <p>🌐 Building digital experiences that matter</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hi ${sanitizedName},

Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.

Your message:
${sanitizedMessage}

I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out to me directly at ${process.env.SMTP_EMAIL}.

Best regards,
Bishnu BK
Full Stack Developer
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptionsToOwner);
    await transporter.sendMail(mailOptionsToSender);

    return NextResponse.json(
      {
        message:
          "Email sent successfully! Check your inbox for a confirmation.",
        remaining: rateLimitResult.remaining,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        return NextResponse.json(
          {
            error: "Email configuration error. Please try again later.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }
}
