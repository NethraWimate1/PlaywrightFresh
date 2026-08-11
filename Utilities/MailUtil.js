import nodemailer from 'nodemailer';

class MailUtil {

    static async sendReport(    missingGT,
    mismatchGT,
    missingWO,
    mismatchWO) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

       const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL,
   // cc:process.env.CCEMAIL,
    subject: "Ticket Validation Report",

    html: `
    <html>
    <body style="font-family: Arial, sans-serif;">

        <h2 style="color:#2E86C1;">
           BNB Ticket Validation Report
        </h2>

        <p>Hello Team,</p>

        <p>
            The automated Ticket Validation has completed successfully.
        </p>

        <h3>Summary</h3>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
            <tr style="background-color:#D6EAF8;">
                <th>Validation</th>
                <th>Count</th>
            </tr>

            <tr>
                <td>Missing General Tasks</td>
                <td>${missingGT.length}</td>
            </tr>

            <tr>
                <td>Status Mismatch - General Tasks</td>
                <td>${mismatchGT.length}</td>
            </tr>

            <tr>
                <td>Missing Work Orders</td>
                <td>${missingWO.length}</td>
            </tr>

            <tr>
                <td>Status Mismatch - Work Orders</td>
                <td>${mismatchWO.length}</td>
            </tr>
        </table>

        <br>

        ${
        mismatchGT.length > 0
        ?
        `
        <h3 style="color:red;">General Task Mismatches</h3>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
            <tr style="background-color:#F5B7B1;">
                <th>Ticket ID</th>
                <th>Ticket Overview Status</th>
                <th>General Task Status</th>
            </tr>

            ${
            mismatchGT.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.overviewStatus}</td>
                <td>${item.actualStatus}</td>
            </tr>
            `).join("")
            }

        </table>
        `
        :
        `<p style="color:green;"><b>✔ No General Task mismatches found.</b></p>`
        }

        <br>

        ${
        mismatchWO.length > 0
        ?
        `
        <h3 style="color:red;">Work Order Mismatches</h3>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
            <tr style="background-color:#F5B7B1;">
                <th>Work Order ID</th>
                <th>Ticket Overview Status</th>
                <th>Work Order Status</th>
            </tr>

            ${
            mismatchWO.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.overviewStatus}</td>
                <td>${item.actualStatus}</td>
            </tr>
            `).join("")
            }

        </table>
        `
        :
        `<p style="color:green;"><b>✔ No Work Order mismatches found.</b></p>`
        }

        <br>

        ${
        missingGT.length > 0
        ?
        `
        <h3 style="color:orange;">Missing General Tasks</h3>

        <ul>
            ${
            missingGT.map(item => `<li>${item.id}</li>`).join("")
            }
        </ul>
        `
        :
        ""
        }

        ${
        missingWO.length > 0
        ?
        `
        <h3 style="color:orange;">Missing Work Orders</h3>

        <ul>
            ${
            missingWO.map(item => `<li>${item.id}</li>`).join("")
            }
        </ul>
        `
        :
        ""
        }

        <br>

        <p>
            Regards,<br>
            <b>Automation Framework</b>
        </p>

    </body>
    </html>
    `
};

        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully.");
    }
}

export default MailUtil;
