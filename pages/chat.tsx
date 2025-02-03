import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenAI from 'openai';
import {Button} from "@heroui/react";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [...messages, newMessage]
      });

      const assistantResponse = response.choices[0].message;
      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'system', content: `Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col bg-white shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-center text-white">
        <h1 className="text-xl font-bold">AI Chat</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                p-3 rounded-lg max-w-[80%]
                ${msg.role === 'user'
                ? 'bg-blue-100 text-blue-800 self-end ml-auto'
                : 'bg-gray-100 text-gray-800 self-start'}
              `}
            >
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center border-t p-4 space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-grow rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onPress={sendMessage}
          disabled={!input.trim() || isLoading}
          className="
            bg-blue-500 text-white p-2 rounded-lg
            hover:bg-blue-600 disabled:opacity-50
            transition-colors duration-200
          "
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;