# InvestoLearn

InvestoLearn offers plain-English lessons and tools for understanding shares, markets and investment risk.

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

The site uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load Geist for body text and Bricolage Grotesque for headings.

## Market data

The Markets and News pages use Finnhub for stock searches, quotes, movers and news. Set `FINNHUB_API_KEY` in `.env.local` for local development and in your hosting provider's server-side environment configuration for deployment. Historical stock charts and the "What if I'd invested" calculator use Twelve Data and require `TWELVEDATA_API_KEY` in the same server-side configuration. Keep both API keys private; do not rename them with a `NEXT_PUBLIC_` prefix.

## Weekly email signup

Email signups are stored in Supabase; the site does not send emails. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` for local development and in your hosting provider's server-side environment configuration. Keep the service role key private and do not use a `NEXT_PUBLIC_` prefix. Apply [`supabase/subscribers.sql`](./supabase/subscribers.sql) to create the subscribers table.

## Site metadata

Set `NEXT_PUBLIC_SITE_URL` to the site's public HTTPS origin, such as `https://your-domain.example`, in `.env.local` and your deployment environment. It is used for canonical links, the sitemap, robots metadata and structured data. A placeholder fallback is used when it is not set, so configure the real production URL before launch. This variable is a public URL, not a secret.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
