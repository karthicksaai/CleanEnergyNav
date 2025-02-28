"use client";

import React, { useState, useEffect, useRef, type FormEvent } from 'react'; //Import FormEvent here.
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";

//Define type interface
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const SustainabilityChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]); // set messages is for storing the message interface
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null); // It is a html element

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => { // FormEvent is used here.
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = { text: inputText, sender: 'user' };//Interface is for text, and sender
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot', { message: inputText });
      const botMessage: Message = { text: response.data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error communicating with chatbot API:', error);
      setMessages((prev) => [...prev, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bot className="w-6 h-6 text-green-600" />
            Sustainability Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg: Message, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                    {msg.sender === 'user' ?
                      <User className="w-4 h-4 text-blue-600" /> :
                      <Bot className="w-4 h-4 text-green-600" />
                    }
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="bg-gray-100 rounded-full p-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask about sustainable practices..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityChatbot;