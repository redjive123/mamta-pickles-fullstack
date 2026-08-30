# Mamta Pickles REST API

Node.js and Express RESTful API backend service for the Mamta Pickles platform.

## Features
- MongoDB object modeling with Mongoose and graceful fallback datastore.
- User authentication utilizing JSON Web Tokens (JWT) and bcrypt password hashing.
- Product catalog API supporting search queries, category filters, and sorting.
- Order processing, customer history tracking, and administrative management.
- Razorpay payment order generation and HMAC-SHA256 signature verification.

## API Documentation
See root repository README.md for full REST API specifications.

## Local Execution
```bash
npm install
npm run dev
```
Server runs at `http://localhost:5000`.
