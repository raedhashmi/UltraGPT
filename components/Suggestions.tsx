'use client';

import { Card, Heading, Button } from '@radix-ui/themes'
import React, { useRef, useEffect, useState } from 'react';

export default function Suggestions({ chatHistory, prompt }: { chatHistory: string | null, prompt: any}) {
  const hideCard = chatHistory !== null;
  const listRef = useRef<HTMLDivElement>(null);
  const [listWidth, setListWidth] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      setListWidth(listRef.current.offsetWidth);
    }
  }, []);

  const suggestions = [
    "What's AI?", "Summarize this", "Write a blog", "Suggest topics", "Explain GPT", "Improve writing", "Make a list", "Give me tips", "Find sources"
  ];

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-32 w-full max-w-3xl p-4">
      <Card hidden={hideCard}>
        <Heading align="center" size="4" mb="2">What's on your mind?</Heading>
        <div className="w-full relative overflow-hidden whitespace-nowrap">
          <div className="pointer-events-none bg-gradient-to-r from-white [body.theme-dark_&]:from-stone-900 to-transparent absolute left-0 top-0 h-full w-16 z-10"/>
          <div className="pointer-events-none bg-gradient-to-l from-white [body.theme-dark_&]:from-stone-900 to-transparent absolute right-0 top-0 h-full w-16 z-10"/>
          <div className="flex animate-scroll gap-4" style={{ width: listWidth ? `${listWidth * 2}px` : 'auto' }}>
            <div ref={listRef} className="flex gap-4">
              {suggestions.map((text, i) => (
                <Button key={i} color='gray' variant='soft' onClick={() => { prompt.value = text; prompt.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true })); }}>{text}</Button>
              ))}
            </div>
            <div className="flex gap-4">
              {suggestions.map((text, i) => (
                <Button key={i + suggestions.length} color='gray' variant='soft' onClick={() => { prompt.value = text; prompt.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true })); }}>{text}</Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}