'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MessageCircle, Send, X, HelpCircle } from 'lucide-react';
import { findAnswer, getSuggestedQuestions } from '@/lib/chatbot/knowledge-base';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  relatedLessons?: string[];
}

export function AskChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your learning assistant. Ask me anything about Bitcoin or Softwar, and I'll help you understand the concepts. Try asking: 'What is proof-of-work?' or 'Why does decentralization matter?'"
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const suggestedQuestions = getSuggestedQuestions();

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate thinking delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find answer from knowledge base
    const answer = findAnswer(input);

    let assistantMessage: Message;
    if (answer) {
      assistantMessage = {
        role: 'assistant',
        content: answer.answer,
        relatedLessons: answer.relatedLessons
      };
    } else {
      assistantMessage = {
        role: 'assistant',
        content: "I don't have a specific answer for that question yet, but I can help with questions about:\n\n• What is proof-of-work?\n• What is power projection?\n• Why is Bitcoin important for national security?\n• What is the Electro-Cyber Dome?\n• How does Bitcoin mining work?\n\nTry asking one of these, or browse the lessons to learn more!"
      };
    }

    setMessages(prev => [...prev, assistantMessage]);
    setIsThinking(false);
  }

  function handleSuggestion(question: string) {
    setInput(question);
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! Ask me anything about Bitcoin or Softwar."
    }]);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">Ask Me Anything</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] flex flex-col bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl" style={{ backgroundColor: 'white' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ask Me Anything</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={clearChat}>
            Clear
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }`} style={{ backgroundColor: msg.role === 'user' ? undefined : '#f3f4f6' }}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.relatedLessons && msg.relatedLessons.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-xs font-medium mb-1">Related lessons:</p>
                  <div className="space-y-1">
                    {msg.relatedLessons.map((lesson, i) => (
                      <Link key={i} href={lesson} onClick={() => setIsOpen(false)}>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                          → {lesson.split('/').pop()?.replace(/-/g, ' ')}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <p className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(q)}
                className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
            disabled={isThinking}
          />
          <Button type="submit" size="sm" disabled={isThinking || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
