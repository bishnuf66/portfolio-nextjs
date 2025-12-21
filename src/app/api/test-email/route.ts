import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// This is a development-only endpoint to test email configuration
export async function GET(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "This endpoint is only available in development" },
            { status: 403 },
        );
    }

    try {
        console.log("Starting email configuration test...");

        // Check environment variables
        const requiredEnvVars = [
            "SMTP_HOST",
            "SMTP_PORT",
            "SMTP_EMAIL",
            "SMTP_PASSWORD",
        ];
        const missingVars = requiredEnvVars.filter((varName) =>
            !process.env[varName]
        );

        if (missingVars.length > 0) {
            return NextResponse.json(
                {
                    error: "Missing environment variables",
                    missing: missingVars,
                    available: requiredEnvVars.filter((varName) =>
                        !!process.env[varName]
                    ),
                },
                { status: 500 },
            );
        }

        console.log("Environment variables check passed");
        console.log("Config:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_EMAIL,
            passLength: process.env.SMTP_PASSWORD?.length,
            passPreview: process.env.SMTP_PASSWORD?.substring(0, 4) + "****",
        });

        // Create transporter (correct method name is createTransport, not createTransporter)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            debug: true, // Enable debug for testing
            logger: true, // Enable logging for testing
        });

        // Verify connection
        console.log("Testing SMTP connection...");
        await transporter.verify();
        console.log("SMTP connection test successful");

        // Send test email
        console.log("Sending test email...");
        const testEmail = {
            from: `"Test Email" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL,
            subject: "✅ Email Configuration Test - Success!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4CAF50;">🎉 Email Configuration Working!</h1>
          <p>Your Nodemailer setup is working correctly.</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>Host: ${process.env.SMTP_HOST}</li>
            <li>Port: ${process.env.SMTP_PORT}</li>
            <li>Email: ${process.env.SMTP_EMAIL}</li>
          </ul>
          <p>You can now receive contact form submissions!</p>
          <p style="color: #666; font-size: 12px;">Test sent at: ${
                new Date().toLocaleString()
            }</p>
        </div>
      `,
            text: `
Email Configuration Test - Success!

Your Nodemailer setup is working correctly.

Configuration:
- Host: ${process.env.SMTP_HOST}
- Port: ${process.env.SMTP_PORT}
- Email: ${process.env.SMTP_EMAIL}

You can now receive contact form submissions!

Test sent at: ${new Date().toLocaleString()}
      `,
        };

        const result = await transporter.sendMail(testEmail);
        console.log("Test email sent successfully:", result.messageId);

        return NextResponse.json(
            {
                message:
                    "Email configuration test successful! Check your inbox.",
                messageId: result.messageId,
                config: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    email: process.env.SMTP_EMAIL,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Email test failed:", error);

        let errorMessage = "Unknown error";
        let errorDetails = {};

        if (error instanceof Error) {
            errorMessage = error.message;
            errorDetails = {
                name: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
            };
        }

        return NextResponse.json(
            {
                error: "Email configuration test failed",
                message: errorMessage,
                details: errorDetails,
                config: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    email: process.env.SMTP_EMAIL,
                    hasPassword: !!process.env.SMTP_PASSWORD,
                },
            },
            { status: 500 },
        );
    }
}
