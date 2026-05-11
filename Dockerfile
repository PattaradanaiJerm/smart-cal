# ─────────────────────────────────────────────
# Stage 1: deps — install production deps only
# ─────────────────────────────────────────────
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────
# Stage 2: builder — build the Next.js app
# ─────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Provide dummy env vars so the build doesn't fail on missing values.
# Real values are injected at runtime via docker-compose or the hosting platform.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=https://smartcalc.app
ENV NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3: runner — minimal production image
# ─────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy only what's needed from the standalone build
COPY --from=builder /app/public          ./public
COPY --from=builder /app/.next/static    ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
