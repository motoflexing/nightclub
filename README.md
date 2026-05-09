# Nightlife Platform

A full-stack MERN MVP for nightlife event distribution and RSVP tracking in Guwahati and Delhi.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas with Mongoose
- Image upload: Cloudinary
- Deployment targets: Vercel frontend, Render backend

## Local Setup

1. Install backend dependencies:

```bash
cd server
npm install
```

2. Create `server/.env` from `server/.env.example` and fill in MongoDB Atlas, JWT and Cloudinary values.

3. Seed demo data:

```bash
npm run seed
```

If `MONGODB_URI` is not set, the backend runs with in-memory demo data so the MVP can be tested immediately. Use MongoDB Atlas credentials before deploying.

4. Start backend:

```bash
npm run dev
```

5. Install frontend dependencies:

```bash
cd ../client
npm install
```

6. Create `client/.env` from `client/.env.example`.

7. Start frontend:

```bash
npm run dev
```

## Demo Accounts

All seeded accounts use password `password123`.

- Admin: `9999999999`
- Promoter: `8888888888`
- User: `7777777777`

## Environment Variables

Server:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLIENT_URL`

Client:

- `VITE_API_URL`

## Deployment

### Render Backend

1. Create a new Render web service from the repository.
2. Set root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all server environment variables.
6. Set `CLIENT_URL` to the Vercel frontend URL after deployment.

### Vercel Frontend

1. Create a new Vercel project from the repository.
2. Set root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` as `https://your-render-service.onrender.com/api`.

## Referral Links

Promoter referral links use `?ref=CODE`. The event detail RSVP endpoint stores the matching active promoter on the RSVP.
