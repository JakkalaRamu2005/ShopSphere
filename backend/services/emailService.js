const nodemailer = require('nodemailer');

// Create transporter
let transporter;
try {
    if (process.env.EMAIL_USER && (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS)) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
            }
        });
    } else {
        console.warn('Email service: Credentials missing. Emails will not be sent.');
    }
} catch (error) {
    console.error('Email service initialization error:', error);
}

// Email templates
const emailTemplates = {
    welcome: (userName) => ({
        subject: 'Welcome to ShopEase! 🎉',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to ShopEase!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName}! 👋</h2>
                        <p>Thank you for joining ShopEase! We're excited to have you as part of our community.</p>
                        <p>You can now:</p>
                        <ul>
                            <li>Browse thousands of products</li>
                            <li>Add items to your wishlist</li>
                            <li>Track your orders</li>
                            <li>Get exclusive deals</li>
                        </ul>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" class="button">Start Shopping</a>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <p>Happy Shopping!</p>
                        <p><strong>The ShopEase Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 ShopEase. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    orderConfirmation: (userName, orderId, totalAmount, items) => ({
        subject: `Order Confirmation - #${orderId} 📦`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; }
                    .order-summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Order Confirmed! ✓</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName}!</h2>
                        <p>Thank you for your order. We've received it and will process it shortly.</p>
                        <div class="order-summary">
                            <h3>Order #${orderId}</h3>
                            ${items.map(item => `
                                <div class="item">
                                    <span>${item.title} (x${item.quantity})</span>
                                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                            <div class="total">
                                <span>Total:</span>
                                <span>₹${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${orderId}" class="button">Track Order</a>
                        <p>We'll send you another email when your order ships.</p>
                        <p><strong>The ShopEase Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 ShopEase. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    orderStatusUpdate: (userName, orderId, oldStatus, newStatus) => ({
        subject: `Order #${orderId} - Status Updated to ${newStatus.toUpperCase()} 📦`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                    .status { font-size: 24px; font-weight: bold; color: #667eea; text-transform: uppercase; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Order Status Updated!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${userName}!</h2>
                        <p>Your order #${orderId} status has been updated.</p>
                        <div class="status-box">
                            <p>Status changed from: <strong>${oldStatus}</strong></p>
                            <p>to</p>
                            <p class="status">${newStatus}</p>
                        </div>
                        ${newStatus === 'delivered' ? '<p>🎉 Your order has been delivered! We hope you enjoy your purchase.</p>' : ''}
                        ${newStatus === 'shipped' ? '<p>📦 Your order is on its way! You should receive it soon.</p>' : ''}
                        ${newStatus === 'cancelled' ? '<p>Your order has been cancelled. If you didn\'t request this, please contact support.</p>' : ''}
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${orderId}" class="button">View Order Details</a>
                        <p><strong>The ShopEase Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 ShopEase. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    })
};

// Send email function
const sendEmail = async (to, template) => {
    try {
        const mailOptions = {
            from: `ShopEase <${process.env.EMAIL_USER}>`,
            to,
            subject: template.subject,
            html: template.html
        };

        if (!transporter) {
            console.warn('Skipping email send: Transporter not configured');
            return { success: false, error: 'Transporter not configured' };
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

// Export functions
module.exports = {
    sendWelcomeEmail: async (userEmail, userName) => {
        return await sendEmail(userEmail, emailTemplates.welcome(userName));
    },

    sendOrderConfirmationEmail: async (userEmail, userName, orderId, totalAmount, items) => {
        return await sendEmail(userEmail, emailTemplates.orderConfirmation(userName, orderId, totalAmount, items));
    },

    sendOrderStatusUpdateEmail: async (userEmail, userName, orderId, oldStatus, newStatus) => {
        return await sendEmail(userEmail, emailTemplates.orderStatusUpdate(userName, orderId, oldStatus, newStatus));
    }
};
