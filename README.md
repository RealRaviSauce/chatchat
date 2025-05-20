# Project Intake Chatbot

A Next.js-based chatbot component for collecting project information from clients.

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

## Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add the following environment variable in Vercel dashboard:
   - Name: `NEXT_PUBLIC_OPENAI_API_KEY`
   - Value: Your OpenAI API key
4. Deploy!

## Usage

Import the chatbot component into any page:

```tsx
import IntakeChatbot from '../components/IntakeChatbot';

export default function Page() {
  return <IntakeChatbot />;
}
```

## Features

- Structured conversation flow for project intake
- Integration with OpenAI Assistant API
- Real-time message handling
- TypeScript support
- Responsive design

## Environment Variables

- `NEXT_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key (set in Vercel dashboard for production) 