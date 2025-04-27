import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

import { decrypt } from './ccavenue/Crypto.js';
import { ccavRequestHandler } from './ccavenue/ccavRequestHandler.js';
import { ccavResponseHandler } from './ccavenue/ccavResponseHandler.js';

import databaseConnection from "./db/databaseConnection.js";
import categoryRouter from './routes/categoryRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';
import classRouter from './routes/classRoutes.js';
import sessionRouter from './routes/sessionRoutes.js';
import transporter from './utils/nodemailerTransporter.js';
import assessmentRouter from './routes/assessmentRoutes.js';
import answerRouter from './routes/answerRoutes.js';
import certificateRouter from './routes/certificateRoutes.js';
import moduleRouter from './routes/moduleRoutes.js';
import liveLinkRouter from './routes/LiveLinkRoutes.js';
import recordingRouter from './routes/recordingRoutes.js';
import materialRouter from './routes/materialRoutes.js';



// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Declaration
dotenv.config();
const app = express();

// CORS Policies
app.use(cors({
  origin: ["http://localhost:5173", "https://future-insights.onrender.com", "http://futureinsights.ae",
    "https://futureinsights.ae"],
  credentials: true,
  optionsSuccessStatus: 200,
}
));

// Configuration Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Routes / APIs
app.use("/category", categoryRouter);
app.use("/course", courseRouter);
app.use("/user", userRouter);
app.use("/class", classRouter);
app.use("/session", sessionRouter);
app.use("/assessment", assessmentRouter);
app.use("/answer", answerRouter);
app.use("/certification", certificateRouter);
app.use("/module", moduleRouter);
app.use("/live-link", liveLinkRouter);
app.use("/recording", recordingRouter);
app.use("/material", materialRouter);



// test nodemailer
app.post("/send-test-email", async (req, res) => {
  try {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: "yahyanashar22@gmail.com",
      subject: "How are you today?",
      text: "This is a test email from your Nodemailer setup!",
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent!", info });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});




// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Serve ccavenue folder as static
app.use('/ccavenue', express.static(path.join(__dirname, 'ccavenue')));

// * CCAvenue Block ( START )
// * ###############################################################
// CCAvenue payment form route (optional: serve it as a static form)
app.get('/ccavenue-payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'ccavenue', 'dataForm.html'));
});

// Handle encryption and redirection to CCAvenue
app.post('/ccavRequestHandler', ccavRequestHandler);

// Handle CCAvenue callback/response after payment
app.post('/ccavResponseHandler', ccavResponseHandler);

app.post('/payment-response', express.urlencoded({ extended: true }), (req, res) => {
  const encryptedResponse = req.body.encResp;
  console.log("Encrypted Response from CCAvenue:", encryptedResponse);

  try {
    const decrypted = decrypt(encryptedResponse);
    const responseParams = Object.fromEntries(new URLSearchParams(decrypted));

    console.log("Decrypted Response:", responseParams);

    // Handle success, failure, etc.
    if (responseParams.order_status === "Success") {
      // ✅ Store to DB, show success page, etc.
      res.send("<h2>Payment Successful!</h2>");
    } else {
      // ❌ Handle failure or aborted transaction
      res.send(`<h2>Payment ${responseParams.order_status}</h2><p>${responseParams.status_message}</p>`);
    }
  } catch (error) {
    console.error("Decryption Error:", error);
    res.status(500).send("Error processing payment response.");
  }
});

app.post('/payment-cancel', (req, res) => {
  res.send("<h2>Transaction Cancelled by User</h2>");
});
// * ###############################################################
// * CCAvenue Block ( END )

// Handle POST request to the home route and serve index.html
app.post('*', (req, res) => {
  console.log('Received POST request');
  // Send the React app's index.html in response to the POST request
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


// Connect to server
app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`Server Running On Port: ${process.env.PORT}`);
  } else {
    console.log("Couldn't Connect To Server!");
    console.error(`Error: ${error}`);
  }
});
databaseConnection();