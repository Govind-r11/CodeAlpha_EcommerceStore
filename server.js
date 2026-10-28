const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const Order = require("./models/Order");
const User = require("./models/User");

const app = express();
const PORT = 3000;

// Check required environment variables
if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD_HASH ||
    !process.env.SESSION_SECRET
) {
    throw new Error("Admin security settings are missing from .env");
}

// Middleware
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
app.use(
    session({
        name: "admin.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: "sessions",
            ttl: 30 * 60
        }),

        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 60 * 1000
        }
    })
);

// product list
const products = [
    { id: 1, name: "Wireless Headphones", price: 1499 },
    { id: 2, name: "Smart Watch", price: 1999 },
    { id: 3, name: "Apple Phone", price: 119499 },
    { id: 4, name: "Lenevo Laptop", price: 1499 },
    { id: 5, name: "JBL soundbaar", price: 1499 },
    { id: 6, name: "Running Shoes", price: 2499 },
    { id: 7, name: "Gray Mercedes", price: 5000000 },
    { id: 8, name: "Fortuner car", price: 3000000 },
    { id: 9, name: "Duke 400", price: 3500000 },
    { id: 10, name: "Hunter 350", price: 250000 }
];

// Customer Registration

app.post("/api/customer/register", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (
            cleanName.length < 1 ||
            cleanName.length > 100 ||
            cleanEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
            password.length < 8 ||
            password.length > 200
        ) {
            return res.status(400).json({
                message:
                    "Please enter valid details. Password must be 8-200 characters."
            });
        }

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = new User({
            name: cleanName,
            email: cleanEmail,
            passwordHash
        });

        await newUser.save();
        return res.status(201).json({
            message: "Registration successful!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }
        console.error("Customer registration failed:", error.message);

        return res.status(500).json({
            message: "Registration failed. Please try again."
        });
    }
});

app.post("/api/customer/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            email.length > 254 ||
            password.length > 200
        ) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const cleanEmail = email.trim().toLowerCase();
        const user = await User.findOne({
            email: cleanEmail
        }).select("+passwordHash");

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        req.session.regenerate((error) => {
            if (error) {
                return res.status(500).json({
                    message: "Login failed. Please try again."
                });
            }

            req.session.customerId = user._id.toString();
            req.session.customerName = user.name;
            req.session.save((saveError) => {
                if (saveError) {
                    return res.status(500).json({
                        message: "Login failed. Please try again."
                    });
                }

                return res.json({
                    message: "Login successful!",
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        });
    } catch (error) {
        console.error("Customer login failed:", error.message);

        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
});

app.get("/api/customer/me", async (req, res) => {
    try {
        if (!req.session.customerId) {
            return res.json({
                loggedIn: false
            });
        }

        const user = await User.findById(
            req.session.customerId
        );

        if (!user) {
            req.session.customerId = null;
            req.session.customerName = null;

            return res.json({
                loggedIn: false
            });
        }

        return res.json({
            loggedIn: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(
            "Checking customer session failed:",
            error.message
        );

        return res.status(500).json({
            message: "Unable to check login status."
        });
    }
});

app.get("/api/customer/orders", async (req, res) => {
    try {
        // Customer login Mandetory
        if (!req.session.customerId) {
            return res.status(401).json({
                message: "Please login to view your orders."
            });
        }

        // logged-in Customer's Order
        const orders = await Order.find({
            customerId: req.session.customerId
        })
            .sort({ orderDate: -1 })
            .lean();

        return res.json({ orders });
    } catch (error) {
        console.error(
            "Fetching customer orders failed:",
            error.message
        );

        return res.status(500).json({
            message: "Unable to fetch your orders."
        });
    }
});

// Admin Login

app.post("/api/admin/login", async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            username.length > 100 ||
            password.length > 200
        ) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const validUsername =
            username === process.env.ADMIN_USERNAME;

        const validPassword = await bcrypt.compare(
            password,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!validUsername || !validPassword) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        req.session.regenerate((error) => {
            if (error) {
                console.error(
                    "Session regeneration failed:",
                    error.message
                );

                return res.status(500).json({
                    message: "Login failed. Please try again."
                });
            }

            req.session.isAdmin = true;
            req.session.save((saveError) => {
                if (saveError) {
                    console.error(
                        "Admin session save failed:",
                        saveError.message
                    );

                    return res.status(500).json({
                        message: "Login failed. Please try again."
                    });
                }

                return res.json({
                    message: "Admin login successful!"
                });
            });
        });
    } catch (error) {
        console.error("Admin login failed:", error.message);

        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
});

// Admin Authorization

function requireAdmin(req, res, next) {
    if (!req.session || req.session.isAdmin !== true) {
        return res.status(401).json({
            message: "Please login as admin first."
        });
    }

    next();
}

// Admin Orders

app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ orderDate: -1 })
            .lean();

        return res.json({ orders });
    } catch (error) {
        console.error("Fetching orders failed:", error.message);

        return res.status(500).json({
            message: "Unable to fetch orders."
        });
    }
});

// Admin Logout

app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Admin logout failed:", error.message);

            return res.status(500).json({
                message: "Logout failed. Please try again."
            });
        }

        res.clearCookie("admin.sid", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });

        return res.json({
            message: "Admin logout successful!"
        });
    });
});

// Customer place order

app.post("/api/orders", async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerAddress,
            items
        } = req.body || {};

        const customerId = req.session.customerId || null;
        if (
            typeof customerName !== "string" ||
            typeof customerEmail !== "string" ||
            typeof customerAddress !== "string" ||
            !customerName.trim() ||
            !customerEmail.trim() ||
            !customerAddress.trim() ||
            customerName.trim().length > 100 ||
            customerEmail.trim().length > 254 ||
            customerAddress.trim().length > 1000 ||
            !Array.isArray(items) ||
            items.length === 0 ||
            items.length > products.length
        ) {
            return res.status(400).json({
                message: "Please provide valid order details."
            });
        }

        const orderItems = [];
        const seenProductIds = new Set();

        for (const item of items) {
            const productId = Number(item.id);
            const quantity = Number(item.quantity);

            const product = products.find(
                (p) => p.id === productId
            );

            if (
                !product ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 100 ||
                seenProductIds.has(productId)
            ) {
                return res.status(400).json({
                    message: "Invalid product or quantity."
                });
            }

            seenProductIds.add(productId);

            orderItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity
            });
        }

        const total = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const newOrder = new Order({
            customerId: customerId,
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim().toLowerCase(),
            customerAddress: customerAddress.trim(),
            items: orderItems,
            total,
            orderDate: new Date()
        });

        const savedOrder = await newOrder.save();

        return res.status(201).json({
            message: "Order saved successfully!",
            order: savedOrder
        });
    } catch (error) {
        console.error("Saving order failed:", error.message);

        return res.status(500).json({
            message: "Unable to place order. Please try again."
        });
    }
});

// Serve Frontend File

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}
startServer();
