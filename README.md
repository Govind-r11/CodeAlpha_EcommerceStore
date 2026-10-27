# CodeAlpha E-commerce Store

A full-stack e-commerce web application built as part of my CodeAlpha Full Stack Development Internship project.

## About the Project

This project is an e-commerce website where customers can browse products, create an account, log in, add products to their shopping cart, and place orders. It also includes customer order history and an admin dashboard for managing and viewing orders.

## Features

- Product listing with images, names, and prices
- Product categories, including cars and bikes
- Product search and filtering
- Customer registration and login
- Secure password hashing using bcrypt
- Shopping cart and checkout
- Order storage in MongoDB
- Customer order history
- Admin login and order dashboard
- Session-based authentication

## Technologies Used

**Frontend:** HTML, CSS, JavaScript

**Backend:** Node.js, Express.js

**Database:** MongoDB, Mongoose

**Authentication and Security:** bcryptjs, express-session, dotenv

## Project Setup

### Prerequisites

- Node.js and npm
- MongoDB database

### Installation

1. Clone or download this repository.
2. Open the project folder in the terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and configure the required environment variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD_HASH=your_admin_password_hash
   SESSION_SECRET=your_random_session_secret
   ```

5. Start the server:

   ```bash
   node server.js
   ```

6. Open the website in your browser:

   `http://localhost:3000/index.html`

## Security Notes

- Keep `.env` private and never upload real credentials.
- The `.gitignore` file should exclude `.env` and `node_modules/`.
- Customer passwords are hashed before being stored.
- Protected routes require appropriate authentication.

## Project Purpose

This project demonstrates practical full-stack web development skills, including frontend development, REST API integration, database operations, authentication, session management, and e-commerce order processing.

**Developed as part of the CodeAlpha Full Stack Development Internship.**