import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';

// Dotenv is used for security to not get user personal information in your file
dotenv.config();

// For server

const app = express();

app.use(express.static("Public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "Public" });
});

// Stripe => For online payment
 
let stripeGateway = stripe(process.env.stripe_api);

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
