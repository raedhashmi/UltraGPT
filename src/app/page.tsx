import React from 'react'
import Chat from '../../components/Chat';

export default function home() {
  return (
    <main className="flex-1 flex flex-col min-h-0">
      <Chat openaiApiKey={process.env.NEXT_PUBLIC_OPENAI_API_KEY?.toString() || ''} grokApiKey={process.env.NEXT_PUBLIC_GROK_API_KEY?.toString() || ''}/>
    </main>
  )
}