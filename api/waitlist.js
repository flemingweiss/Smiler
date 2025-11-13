import validator from 'validator';
import { Resend } from 'resend';
import mongoose from 'mongoose';

// MongoDB Waitlist Model
const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  signupDate: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

const Waitlist = mongoose.models.Waitlist || mongoose.model('Waitlist', waitlistSchema);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// MongoDB connection helper
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = connection;
  return connection;
}

/**
 * Vercel Serverless Function: Waitlist Signup
 * Endpoint: POST /api/waitlist
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const { email } = req.body;

  // Validate and sanitize email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      error: 'Email address is required'
    });
  }

  // Trim and normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // Validate email format using validator library
  if (!validator.isEmail(normalizedEmail)) {
    return res.status(400).json({
      error: 'Please enter a valid email address'
    });
  }

  // Check email length (prevent extremely long emails)
  if (normalizedEmail.length > 254) { // RFC 5321
    return res.status(400).json({
      error: 'Email address is too long'
    });
  }

  // Sanitize email to prevent any potential injection
  const sanitizedEmail = validator.normalizeEmail(normalizedEmail, {
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false
  });

  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Check if email is admin email (whitelist for testing)
    const isAdminEmail = sanitizedEmail === process.env.ADMIN_EMAIL?.toLowerCase();

    if (!isAdminEmail) {
      // Check if email already exists in waitlist (skip for admin)
      const existingEmail = await Waitlist.findOne({ email: sanitizedEmail });

      if (existingEmail) {
        return res.status(409).json({
          error: "You're already on the waitlist!",
          alreadySubscribed: true
        });
      }

      // Save new email to database before sending confirmation
      const waitlistEntry = new Waitlist({
        email: sanitizedEmail,
        signupDate: new Date()
      });

      await waitlistEntry.save();
      console.log('✅ Email saved to database:', sanitizedEmail);
    } else {
      console.log('🧪 Admin email detected - skipping duplicate check and database save (testing mode)');
    }

    // Send confirmation email to the user
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Smiler <onboarding@resend.dev>',
      to: [sanitizedEmail],
      subject: '🦷 Welcome to the Smiler Waitlist!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="color-scheme" content="light only">
            <meta name="supported-color-schemes" content="light">
            <title>Welcome to Smiler</title>
            <style>
              :root {
                color-scheme: light only;
                supported-color-schemes: light;
              }
              body {
                background: #ffffff !important;
              }
              .header-bg {
                background-color: #000000 !important;
              }
              .header-text {
                color: #ffffff !important;
              }
              .body-text {
                color: #000000 !important;
              }
              .body-bg {
                background-color: #ffffff !important;
              }
              @media (prefers-color-scheme: dark) {
                body {
                  background: #ffffff !important;
                }
                .header-bg {
                  background-color: #000000 !important;
                }
                .header-text {
                  color: #ffffff !important;
                }
                .body-text {
                  color: #000000 !important;
                }
                .body-bg {
                  background-color: #ffffff !important;
                }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff !important;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 0 0 40px 0;">
                  <table role="presentation" style="width: 600px; max-width: 90%; border-collapse: collapse; background-color: #ffffff !important; border-radius: 24px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">
                    <!-- Header with monochromatic design -->
                    <tr>
                      <td class="header-bg" style="background-color: #000000 !important; padding: 40px 30px; text-align: center;">
                        <h1 class="header-text" style="margin: 0; color: #ffffff !important; font-size: 32px; font-weight: bold; letter-spacing: -0.02em;">
                          🦷 Smiler
                        </h1>
                        <p class="header-text" style="margin: 10px 0 0 0; color: #ffffff !important; font-size: 16px; letter-spacing: -0.01em;">
                          Transform Your Dental Health with AI
                        </p>
                      </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                      <td class="body-bg" style="padding: 40px 30px; background-color: #ffffff !important;">
                        <h2 class="body-text" style="margin: 0 0 20px 0; color: #000000 !important; font-size: 24px; font-weight: bold; letter-spacing: -0.02em;">
                          You're on the List! 🎉
                        </h2>
                        <p class="body-text" style="margin: 0 0 16px 0; color: #000000 !important; font-size: 16px; line-height: 1.6; letter-spacing: -0.01em;">
                          Thank you for joining the Smiler waitlist! We're thrilled to have you as one of our early supporters.
                        </p>
                        <p class="body-text" style="margin: 0 0 16px 0; color: #000000 !important; font-size: 16px; line-height: 1.6; letter-spacing: -0.01em;">
                          Get ready to transform your dental health with:
                        </p>

                        <!-- Features list with monochromatic checkmarks -->
                        <table role="presentation" style="width: 100%; margin: 20px 0;">
                          <tr>
                            <td style="padding: 12px 20px; color: #000000 !important; font-size: 15px; background: rgba(249, 250, 251, 0.9); border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 8px;">
                              <div style="display: flex; align-items: center;">
                                <span style="display: inline-block; width: 20px; height: 20px; background-color: #000000 !important; color: #ffffff !important; border-radius: 50%; text-align: center; line-height: 20px; font-size: 12px; font-weight: bold; margin-right: 12px;">✓</span>
                                <span class="body-text" style="color: #000000 !important; letter-spacing: -0.01em;">AI-powered smile analysis</span>
                              </div>
                            </td>
                          </tr>
                          <tr><td style="height: 8px;"></td></tr>
                          <tr>
                            <td style="padding: 12px 20px; color: #000000 !important; font-size: 15px; background: rgba(249, 250, 251, 0.9); border: 1px solid #e5e7eb; border-radius: 12px;">
                              <div style="display: flex; align-items: center;">
                                <span style="display: inline-block; width: 20px; height: 20px; background-color: #000000 !important; color: #ffffff !important; border-radius: 50%; text-align: center; line-height: 20px; font-size: 12px; font-weight: bold; margin-right: 12px;">✓</span>
                                <span class="body-text" style="color: #000000 !important; letter-spacing: -0.01em;">Smart habit tracking</span>
                              </div>
                            </td>
                          </tr>
                          <tr><td style="height: 8px;"></td></tr>
                          <tr>
                            <td style="padding: 12px 20px; color: #000000 !important; font-size: 15px; background: rgba(249, 250, 251, 0.9); border: 1px solid #e5e7eb; border-radius: 12px;">
                              <div style="display: flex; align-items: center;">
                                <span style="display: inline-block; width: 20px; height: 20px; background-color: #000000 !important; color: #ffffff !important; border-radius: 50%; text-align: center; line-height: 20px; font-size: 12px; font-weight: bold; margin-right: 12px;">✓</span>
                                <span class="body-text" style="color: #000000 !important; letter-spacing: -0.01em;">Personalized dental coaching</span>
                              </div>
                            </td>
                          </tr>
                          <tr><td style="height: 8px;"></td></tr>
                          <tr>
                            <td style="padding: 12px 20px; color: #000000 !important; font-size: 15px; background: rgba(249, 250, 251, 0.9); border: 1px solid #e5e7eb; border-radius: 12px;">
                              <div style="display: flex; align-items: center;">
                                <span style="display: inline-block; width: 20px; height: 20px; background-color: #000000 !important; color: #ffffff !important; border-radius: 50%; text-align: center; line-height: 20px; font-size: 12px; font-weight: bold; margin-right: 12px;">✓</span>
                                <span class="body-text" style="color: #000000 !important; letter-spacing: -0.01em;">Privacy-first approach</span>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <p class="body-text" style="margin: 24px 0 16px 0; color: #000000 !important; font-size: 16px; line-height: 1.6; letter-spacing: -0.01em;">
                          We'll notify you as soon as Smiler launches on iOS. In the meantime, keep brushing and smiling!
                        </p>
                        <p class="body-text" style="margin: 0 0 16px 0; color: #000000 !important; font-size: 16px; line-height: 1.6; letter-spacing: -0.01em;">
                          Cheers,<br>
                          The Smiler Team
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p class="body-text" style="margin: 0 0 8px 0; color: #000000 !important; font-size: 14px; letter-spacing: -0.01em;">
                          Smiler - Transform Your Dental Health
                        </p>
                        <p class="body-text" style="margin: 0; color: #000000 !important; font-size: 12px; letter-spacing: -0.01em;">
                          You're receiving this email because you joined our waitlist.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // Send notification email to admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Smiler <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'your-email@example.com'],
      subject: '🎯 New Waitlist Signup - Smiler',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="color-scheme" content="light only">
            <meta name="supported-color-schemes" content="light">
            <title>New Waitlist Signup</title>
            <style>
              :root {
                color-scheme: light only;
                supported-color-schemes: light;
              }
              body {
                background: #ffffff !important;
              }
              .header-text {
                color: #000000 !important;
              }
              .email-badge {
                background-color: #000000 !important;
                color: #ffffff !important;
              }
              @media (prefers-color-scheme: dark) {
                body {
                  background: #ffffff !important;
                }
                .header-text {
                  color: #000000 !important;
                }
                .email-badge {
                  background-color: #000000 !important;
                  color: #ffffff !important;
                }
              }
            </style>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff !important; margin: 0; padding: 0 20px 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff !important; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
              <h2 class="header-text" style="margin: 0 0 20px 0; color: #000000 !important; font-size: 24px; font-weight: bold; letter-spacing: -0.02em;">
                🎉 New Waitlist Signup!
              </h2>
              <div class="email-badge" style="background-color: #000000 !important; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 0; color: #ffffff !important; font-size: 18px; font-weight: 600; letter-spacing: -0.01em;">
                  ${sanitizedEmail}
                </p>
              </div>
              <p class="header-text" style="margin: 20px 0 0 0; color: #000000 !important; font-size: 14px; letter-spacing: -0.01em;">
                Signed up at: ${new Date().toLocaleString()}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully joined the waitlist! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Error processing waitlist signup:', {
      error: error.message,
      timestamp: new Date().toISOString(),
      email: sanitizedEmail
    });

    // Handle specific MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        error: "You're already on the waitlist!",
        alreadySubscribed: true
      });
    }

    // Handle other errors
    return res.status(500).json({
      error: 'Failed to process your request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
