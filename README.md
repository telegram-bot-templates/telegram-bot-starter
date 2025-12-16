# Telegram Bot Starter

A Telegram bot template with three interfaces for different use cases.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

3. Add your Telegram bot token to `.env`:

```env
TELEGRAM_BOT_API_KEY=your_bot_token_here
DATABASE_URL=postgres://user:password@localhost:5432/dbname
```

## Usage

### CLI (Local Testing)

Test commands locally without Telegram:

```bash
npx cli greet "Alice"
```

### Polling (Development)

Run bot with Telegram polling for local development:

```bash
npm run polling
```

Then interact with your bot on Telegram.

### Webhooks (Production)

Deploy with webhooks for production:

```bash
npm start
```

Set `WEBHOOK_DOMAIN` and `PORT` in your `.env`:

```env
WEBHOOK_DOMAIN=https://your-domain.com
PORT=3000
```

## Available Commands

- `/greet <name>` - Get a personalized greeting

## Development

Start the database:

```bash
docker-compose up -d
```

Run database migrations:

```bash
npx drizzle-kit push
```
