const nodemailer = require("nodemailer");//company email service

//dispach emailto user
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
})

const sendEmail = async ({to, subject, html}) => {
    try {
        await transporter.sendMail({
            from: `Book App Store <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log(`  Email sent to ${to}`);
    } catch (error) {
        console.error(`failed to send email to ${to}`,);
        throw error;
    }
}

const sendWelcomeBackEmail = async (email) =>{
    await sendEmail({
        to: email,
        subject: "Welcome Back to Book App Store",
        html: `<h1>Welcome Back to Book App Store</h1>
        <p>We are glad to have you back! Explore our latest collection of books and enjoy your reading journey.</p>`,
    })
}

module.exports = {
    sendEmail,
    sendWelcomeBackEmail,
};