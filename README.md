# dev-master-view

Next.js app for the dev portal.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Environment

- `APP_URL` — public base URL used for links in verification and password reset emails (default: `http://localhost:3000`, set it in production)
- `EMAIL_VERIFICATION_ENABLED` — set to `false` to skip email verification on register and sign-in (default: enabled)
- `RESEND_API_KEY` — required while email verification is enabled

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint
