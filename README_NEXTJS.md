# Theory Investment Game - Next.js Version

This is a Next.js version of the Theory Investment Game, optimized for deployment on Vercel and other modern hosting platforms.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- At least one LLM API key (OpenAI, Anthropic, or Google)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add at least one API key:
     - `OPENAI_API_KEY` for OpenAI GPT
     - `ANTHROPIC_API_KEY` for Anthropic Claude
     - `GOOGLE_API_KEY` for Google Gemini

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/research-monopoly)

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in the Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add your API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY)

## Features

- Modern Next.js 14+ App Router architecture
- TypeScript support
- API routes for LLM integration
- Optimized for serverless deployment
- Automatic code splitting and optimization

## Game Description

A Monopoly-style board game about investing life in establishing scientific theories. Players move around the board, develop hypotheses, and try to establish proven theories using AI-generated content.

## Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: CSS (preserved from original)
- **AI Integration**: OpenAI, Anthropic Claude, or Google Gemini
- **Deployment**: Vercel (recommended)

## Environment Variables

- `OPENAI_API_KEY`: OpenAI API key (optional, at least one LLM key required)
- `ANTHROPIC_API_KEY`: Anthropic API key (optional)
- `GOOGLE_API_KEY`: Google Gemini API key (optional)

## License

Same as the original project
