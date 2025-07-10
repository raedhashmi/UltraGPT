'use client';

import { Card, Heading, Button } from '@radix-ui/themes'
import React from 'react'

export default function Suggestions({ chatHistory }: { chatHistory: string | null }) {
  const hideCard = chatHistory !== null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-32 w-fit p-4">
      <Card hidden={hideCard}>
      <Heading align="center" size="4" mb="2">What's on your mind?</Heading>
      <div className="w-full overflow-hidden whitespace-nowrap">
        <div className="flex animate-scroll gap-4">
          {["What's AI?", "Summarize this", "Write a blog", "Suggest topics", "Explain GPT", "Improve writing", "Make a list", "Give me tips", "Find sources"].map((text, i) => (
            <Button key={i} color='gray' variant='soft'>{text}</Button>
          ))}
        </div>
      </div>
    </Card>
    </div>
  );
}