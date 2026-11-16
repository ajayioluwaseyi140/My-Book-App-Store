# Book App Project

A small Node.js + Express application for managing a bookstore and user accounts. The project includes authentication, profile handling, book management, category management, and admin-level user access.

## Overview
This app is built as a backend API for a book store where users can:

- register and log in
- manage their profile
- create, view, update, and delete books
- browse books by category
- use admin-only routes to view all users
- sign in with Google OAuth

## Tech Stack
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT authentication
- Argon2 password hashing
- Nodemailer for email sending
- CORS and dotenv

## Main Features
- User registration and login
- JWT-based protected routes
- Google login flow
- Book CRUD operations
- Category support
- User profile data management
- Admin-only user listing
- Static file serving for public assets such as avatars and uploaded files

## Project Structure
- `server.js` - app entry point
- `routes/` - API endpoints for auth, users, books, categories, profiles
- `middleware/` - authentication and error handling
- `helper/` - Prisma client setup
- `prisma/` - database schema and migrations
- `services/` - email-related logic
- `config/` - application configuration values
- `public/` - static content

## Database
The project uses Prisma with PostgreSQL.

Main models include:
- `User`
- `Profile`
- `Category`
- `Book`

## Environment Variables
Create a `.env` file in the project root with values like the following:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bookapp"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
GOOGLE_CLIENT_ID="your-google-client-id"
```

## Getting Started
1. Install dependencies:

```bash
npm install
```

2. Set up your database and generate Prisma client:

```bash
npx prisma generate
```

3. Start the app in development mode:

```bash
npm run dev
```

By default, the server runs on:

```text
http://localhost:4000
```

## Available Routes
Some of the key routes in this project include:

- `POST /auth/login`
- `POST /auth/google-login`
- `POST /user/register`
- `GET /book/allBooks`
- `POST /book/create`
- `PUT /book/update`
- `DELETE /book/delete/:id`
- `GET /user/allUsers` (admin protected)

## Notes
This is a backend-focused bookstore project and is suitable for learning REST API design, Prisma usage, authentication, and role-based access control in a Node.js app.

## License
This project currently does not include a license file.
