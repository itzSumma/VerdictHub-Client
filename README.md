# VerdictHub Client

VerdictHub is an online lawyer hiring platform where clients can browse legal experts, send hiring requests, pay accepted fees through Stripe, and manage comments. Lawyers can manage their legal profiles and hiring requests. Admins can manage users, transactions, and analytics.

## Live Links

- Client: https://verdict-hub-client.vercel.app/
- Server: https://verdict-hub-server.vercel.app/

## Demo Credentials

Use the same password for all demo roles:

```text
Password: VerdictHub@123
```

| Role | Email |
| --- | --- |
| Admin | demo.admin@verdicthub.com |
| Lawyer | demo.lawyer@verdicthub.com |
| User / Client | demo.client@verdicthub.com |

## Key Features

- Email/password and Google authentication with Better Auth
- Role-based dashboard for user, lawyer, and admin
- Public lawyer browsing with search, filters, sorting, skeleton loaders, and pagination
- Lawyer details with hire confirmation modal and comment system
- User hiring history with Stripe payment button
- User profile update with imgBB image upload
- Lawyer legal profile CRUD with publish/unpublish
- Admin user management, all transactions, and analytics overview
- Global loading, custom 404, and error fallback pages
- Secure environment variables for MongoDB, OAuth, Stripe, imgBB, and API URLs

## Main Packages

- Next.js
- React
- Better Auth
- MongoDB
- Stripe React SDK
- imgBB upload API
- Lucide React
- React Hot Toast
- HeroUI

## Local Setup

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and fill in the required credentials.
