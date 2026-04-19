// ============================================================
// Firebase Cloud Function for Sending Emails
// Location: functions/index.js
// ============================================================
// 
// This function automatically sends emails when someone
// submits the contact form.
//
// SETUP:
// 1. firebase init functions
// 2. npm install nodemailer
// 3. Add your Gmail credentials
// 4. firebase deploy --only functions
// ============================================================

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get Gmail configuration from environment
const gmail_user = functions.config().gmail.user;
const gmail_password = functions.config().gmail.password;

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmail_user,
        pass: gmail_password
    }
});

// Cloud Function: Send email when contact form is submitted
exports.sendContactEmail = functions.firestore
    .document("contacts/{docId}")
    .onCreate(async (snap, context) => {
        try {
            const data = snap.data();
            const docId = context.params.docId;

            console.log(`Processing contact submission: ${docId}`);

            // Email to website owner (you)
            const ownerEmailOptions = {
                from: `"${data.name}" <${gmail_user}>`,
                to: gmail_user,
                subject: `📬 New Portfolio Contact: ${data.subject}`,
                replyTo: data.email,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #00d4ff, #a78bfa); padding: 20px; color: white; border-radius: 5px; }
                            .content { background: #f5f5f5; padding: 20px; margin-top: 10px; border-radius: 5px; }
                            .field { margin-bottom: 15px; }
                            .label { font-weight: bold; color: #00d4ff; }
                            .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #00d4ff; }
                            .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2>📬 New Contact Form Submission</h2>
                            </div>
                            
                            <div class="content">
                                <div class="field">
                                    <div class="label">👤 From:</div>
                                    <div class="value">${data.name} (${data.email})</div>
                                </div>

                                <div class="field">
                                    <div class="label">📌 Subject:</div>
                                    <div class="value">${data.subject}</div>
                                </div>

                                <div class="field">
                                    <div class="label">💬 Message:</div>
                                    <div class="value" style="white-space: pre-wrap;">
${data.message}
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="label">⏰ Submitted:</div>
                                    <div class="value">${new Date(data.timestamp).toLocaleString()}</div>
                                </div>

                                <div class="field">
                                    <div class="label">🆔 Reference ID:</div>
                                    <div class="value" style="font-size: 12px; color: #999;">${docId}</div>
                                </div>
                            </div>

                            <div class="footer">
                                <p>This is an automated email from your portfolio contact form.</p>
                                <p>Reply to this email to respond to the sender.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            // Confirmation email to sender
            const senderEmailOptions = {
                from: `"Shahil Sinha" <${gmail_user}>`,
                to: data.email,
                subject: "✅ Thank you for contacting me!",
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #00d4ff, #a78bfa); padding: 20px; color: white; border-radius: 5px; text-align: center; }
                            .content { background: #f5f5f5; padding: 20px; margin-top: 10px; border-radius: 5px; }
                            .footer { margin-top: 20px; padding: 20px; background: #eee; border-radius: 5px; text-align: center; }
                            .social { margin-top: 15px; }
                            .social a { margin: 0 10px; text-decoration: none; color: #00d4ff; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h2>Hello ${data.name},</h2>
                            </div>
                            
                            <div class="content">
                                <p>Thank you so much for reaching out to me! I have received your message and will get back to you as soon as possible.</p>
                                
                                <h3 style="color: #00d4ff; margin-top: 30px;">Your Message:</h3>
                                <p style="background: white; padding: 15px; border-left: 3px solid #00d4ff; white-space: pre-wrap;">
${data.message}
                                </p>

                                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                                    <strong>Submission ID:</strong> ${docId}
                                </p>
                            </div>

                            <div class="footer">
                                <h3>Shahil Sinha</h3>
                                <p>Software Engineer | Full-Stack & AI/ML Developer</p>
                                
                                <div class="social">
                                    📧 <a href="mailto:shahilsinha2004@gmail.com">Email</a> |
                                    📱 +91 8252215686 |
                                    🔗 <a href="https://your-portfolio-url.com">Portfolio</a>
                                </div>
                                
                                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                                    © 2024-2025 Shahil Sinha. All rights reserved.<br>
                                    Built with ❤️ and passion for excellence.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            };

            // Send both emails
            console.log("Sending owner email to:", gmail_user);
            await transporter.sendMail(ownerEmailOptions);
            
            console.log("Sending confirmation email to:", data.email);
            await transporter.sendMail(senderEmailOptions);

            // Update Firestore document with email status
            await snap.ref.update({
                emailSent: true,
                emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "processed"
            });

            console.log("✅ Emails sent successfully for submission:", docId);
            return { success: true };

        } catch (error) {
            console.error("❌ Error sending email:", error);
            
            // Update document with error status
            try {
                await snap.ref.update({
                    emailSent: false,
                    emailError: error.message,
                    status: "error"
                });
            } catch (updateError) {
                console.error("Failed to update error status:", updateError);
            }

            throw new functions.https.HttpsError("internal", 
                `Failed to send email: ${error.message}`);
        }
    });

// ============================================================
// TO DEPLOY THIS FUNCTION:
// 
// 1. Set Gmail credentials:
//    firebase functions:config:set \
//      gmail.user="shahilsinha2004@gmail.com" \
//      gmail.password="your-app-password-16-chars"
//
// 2. Deploy:
//    firebase deploy --only functions
//
// 3. View logs:
//    firebase functions:log
//
// ============================================================
