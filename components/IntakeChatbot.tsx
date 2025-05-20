import { useState, useEffect } from 'react';
import OpenAI from 'openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ClientInfo {
  fullName: string;
  email: string;
  companyName?: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  goals: string;
  additionalNotes?: string;
}

const ASSISTANT_ID = 'asst_voLApCpD9WGXC4xbjTDytGI5';

export default function IntakeChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientInfo, setClientInfo] = useState<Partial<ClientInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const initializeChat = async () => {
    try {
      const thread = await openai.beta.threads.create();
      setThreadId(thread.id);
      
      const initialMessage = {
        role: 'assistant',
        content: "Hi! I'm here to help gather information about your project. Could you please start by telling me your full name?"
      };
      
      setMessages([initialMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleUserMessage = async (content: string) => {
    if (!threadId) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    try {
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content
      });

      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID
      });

      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      
      while (runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      const messages = await openai.beta.threads.messages.list(threadId);
      const assistantMessage = messages.data[0];
      
      if (assistantMessage.role === 'assistant') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage.content[0].text.value
        }]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeChat();
  }, []);

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
        if (input.value.trim()) {
          handleUserMessage(input.value);
          input.value = '';
        }
      }}>
        <input
          type="text"
          name="message"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
} 