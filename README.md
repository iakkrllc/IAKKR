This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Admin / Teams access (Prisma + MySQL scaffold)

This repository now includes a scaffold to manage Teams, Roles and assignments where an "owner" user can create custom roles and grant them to teams.

What was added:
- Prisma schema (prisma/schema.prisma) with User, Team, Role, Membership and TeamRole models.
- Prisma client helper: src/lib/prisma.ts
- Admin API endpoints (app router):
  - GET/POST /api/admin/roles
  - GET/POST /api/admin/teams
  - POST /api/admin/teams/assign
- A simple React admin UI at /admin (src/app/admin) to create roles, create teams and assign roles to teams.
- Helper script to create an initial owner user: scripts/create-owner.js

Quick start (fill in values and run locally):

1. Add a MySQL connection string to your environment (set DATABASE_URL). Prisma config reads it from prisma.config.ts which imports process.env.DATABASE_URL. Example .env entry:

   DATABASE_URL="mysql://user:password@localhost:3306/dbname"

2. Run Prisma migrate to create the schema (requires a running MySQL):

   npx prisma migrate dev --name init

3. Generate the Prisma client (already generated above while scaffolding):

   npx prisma generate

4. Create an initial owner user (this creates owner@example.com as the owner):

   node scripts/create-owner.js

5. Start the Next.js dev server:

   npm run dev

6. Open http://localhost:3000/admin to use the admin UI. For this scaffold the admin UI sends a header `x-user-id: 1` to authenticate as the owner — replace this with real authentication (NextAuth / Supabase / your provider) before production.

Notes and next steps:
- This is a scaffold. Integrate your chosen OAuth (Google) sign-in solution (NextAuth or Supabase) and hook it to the Prisma User model.
- Implement proper authentication and session handling (the admin endpoints currently expect an `x-user-id` header for demo).
- If you prefer to keep using the existing Supabase integration, consider migrating Supabase users into the Prisma-managed MySQL or adapt the role/team logic to use Supabase tables.
