'use client'

import { ChatBubbleIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { Avatar, Card, IconButton, Spinner, TextField } from '@radix-ui/themes'
import React, { useEffect, useRef, useState } from 'react'
import SignupCard from './SignupCard'
import Suggestions from './Suggestions'
import { v4 as uuidv4 } from 'uuid'

export default function Chat({ openaiApiKey, grokApiKey }: { openaiApiKey: string, grokApiKey: string }) {
  const promptRef = useRef<HTMLInputElement>(null)
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [streaming, setStreaming] = useState(false)
  const [ai_model, setAiModel] = useState('gpt-3.5-turbo')
  const [navbarStart, setNavbarStart] = useState('#994700');
  const [navbarEnd, setNavbarEnd] = useState('#3a1b00');

  useEffect(() => {
    // Ensure chat_uuid exists in localStorage
    let uuid = localStorage.getItem('chat_uuid');
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem('chat_uuid', uuid);
    }

    // Load chat history from localStorage on mount
    const historyHtml = localStorage.getItem(`${uuid}_chat_history`);
    if (historyHtml) {
      try {
        const parsed = JSON.parse(historyHtml);
        if (Array.isArray(parsed)) setChatHistory(parsed);
      } catch {
        setChatHistory([]);
      }
    }

    // Load navbar colors
    setNavbarStart(localStorage.getItem('navbarStart') || '#994700');
    setNavbarEnd(localStorage.getItem('navbarEnd') || '#3a1b00');

    // Sync ai_model from localStorage
    if (localStorage.getItem('ai_model')) {
      setAiModel(localStorage.getItem('ai_model') || '');
    } else {
      localStorage.setItem('ai_model', 'gpt-3.5-turbo');
      setAiModel(localStorage.getItem('ai_model') || '');
    }

    // Event listeners for model updates
    const updateModel = () => {
      setAiModel(localStorage.getItem('ai_model') || 'gpt-3.5-turbo');
    };
    window.addEventListener('storage', updateModel);
    window.addEventListener('model-updated', updateModel);

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateModel);
      window.removeEventListener('model-updated', updateModel);
    };
  }, []);

  // Save chat history and navbar colors to localStorage whenever they change
  useEffect(() => {
    const uuid = localStorage.getItem('chat_uuid');
    localStorage.setItem(`${uuid}_chat_history`, JSON.stringify(chatHistory));
    localStorage.setItem('navbarStart', navbarStart);
    localStorage.setItem('navbarEnd', navbarEnd);
    document.documentElement.style.setProperty(
      '--nav-gradient',
      `linear-gradient(to right, ${navbarStart}, ${navbarEnd})`
    );
  }, [chatHistory, navbarStart, navbarEnd]);

  const scrollToBottom = () => {
    document.documentElement.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;
    if (streaming) {
      scrollInterval = setInterval(scrollToBottom, 200);
    } else if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [streaming]);

  const sendMessage = async () => {
    if (!promptRef.current || !promptRef.current.value.trim()) return
    setLoading(true)
    setStreaming(true)
    const messageText = promptRef.current.value.trim()
    promptRef.current.value = '' // clear input
    // Add user message
    setChatHistory(prev => [...prev, { role: 'user', content: messageText }])
    // Prepare messages for API (include all history)
    const messages = [...chatHistory, { role: 'user', content: messageText }]
    // Add a placeholder for the assistant's response
    setChatHistory(prev => [...prev, { role: 'assistant', content: '' }])
    // Scroll after sending
    scrollToBottom();

    // Always get the latest model from localStorage
    const model = localStorage.getItem('ai_model') || ai_model;

    let apiUrl = ''
    let headers: Record<string, string> = {}
    let body: any = {}
    let apiKey = ''

    if (model.toLowerCase().includes('grok')) {
      // Grok API
      apiUrl = 'https://gateway.theturbo.ai/v1/chat/completions'
      apiKey = grokApiKey
      headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
      body = {
        model: model,
        messages: messages,
        stream: true
      }
    } else if (model.includes('gpt')) {
      // OpenAI API
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      apiKey = openaiApiKey
      headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
      body = {
        model: model,
        messages: messages,
        stream: true
      }
    } else {
      setLoading(false)
      setStreaming(false)
      return
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) {
      setLoading(false)
      setStreaming(false)
      return
    }
    let aiContent = ''
    let isDone = false
    const updateAssistantMessage = (content: string) => {
      setChatHistory(prev => {
        // Find the last assistant message and update its content
        const lastAssistantIdx = prev.map(m => m.role).lastIndexOf('assistant')
        if (lastAssistantIdx === -1) return prev
        const updated = [...prev]
        updated[lastAssistantIdx] = { ...updated[lastAssistantIdx], content }
        return updated
      })
    }
    function process({ done, value }: { done: boolean, value?: Uint8Array }): any {
      if (done) {
        setLoading(false)
        setStreaming(false)
        isDone = true
        return
      }
      const lines = decoder.decode(value).split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const json = line.replace('data: ', '')
          if (json === '[DONE]') {
            setLoading(false)
            setStreaming(false)
            isDone = true
            return
          }
          try {
            const parsed = JSON.parse(json)
            const content = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || ''
            aiContent += content
            updateAssistantMessage(aiContent)
          } catch (e) {
            // ignore JSON parse errors
          }
        }
      }
      return reader?.read().then(process)
    }
    reader.read().then(process)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <>
      <Suggestions chatHistory={chatHistory.length > 0 ? 'not-null' : null} />
      <div className="flex-1 h-auto overflow-y-auto p-4 flex flex-col" ref={chatAreaRef}>
        <SignupCard />
        {chatHistory.map((msg, i) => {
          const isLatestAssistant =
            msg.role === 'assistant' && i === chatHistory.length - 1;
          return (
            <Card key={i} className={`m-2 w-fit max-w-[75%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
              <div className={`flex items-center ${msg.role === 'user' ? 'flex-row justify-end' : 'flex-row justify-start'}`}>
                {msg.role === 'user' ? (
                  <>
                    <span className='mx-2'>{msg.content}</span>
                    <Avatar fallback={localStorage.getItem('username')?.charAt(0) || 'U'} className='ml-2' radius='full' variant='soft' />
                  </>
                ) : (
                  <>
                    <img src={'/favicon.ico'} className='mr-2 w-10 h-auto' />
                    <span>{msg.content} {isLatestAssistant && streaming && (
                      <span className="ml-2 animate-pulse">
                        <span className="inline-block w-4 h-4 bg-white rounded-full"></span>
                      </span>
                    )}</span>
                  </>
                )}
              </div>
            </Card>
          )
        })}
      </div>
      <div className="p-4 w-full absolute bottom-0">
        <TextField.Root placeholder='Message anything...' size='3' ref={promptRef} onKeyDown={handleKeyDown}>
          <TextField.Slot>
            <ChatBubbleIcon />
          </TextField.Slot>
          <TextField.Slot>
            <IconButton size='2' variant='ghost' onClick={sendMessage}>
              {loading ? <Spinner size='1' /> : <PaperPlaneIcon width='24px' height='16px' />}
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </div>
    </>
  ) 
}