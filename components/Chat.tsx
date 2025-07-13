'use client'

import { ChatBubbleIcon, ExclamationTriangleIcon, PaperPlaneIcon, CopyIcon, CheckIcon, ReloadIcon, Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Avatar, Card, IconButton, Spinner, TextField, Text } from '@radix-ui/themes'
import { Callout, Button } from '@radix-ui/themes';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import SignupCard from './SignupCard'
import Suggestions from './Suggestions'
import { v4 as uuidv4 } from 'uuid'
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
const QUOTA_TIMEOUT = 600000; // 10 minutes in ms
const SCROLL_THRESHOLD = 2;

export default function Chat({ geminiApiKey }: { geminiApiKey: string }) {
  const promptRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [streaming, setStreaming] = useState(false);
  const [navbarStart, setNavbarStart] = useState('#994700');
  const [navbarEnd, setNavbarEnd] = useState('#3a1b00');
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [uuid, setUuid] = useState<string | null>(null);
  const [noScroll, setNoScroll] = useState(true);
  const [ai_model, setAiModel] = useState<string>('gemini-1.5-flash');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [quotaTimer, setQuotaTimer] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'syntax' | 'render'>('syntax');
  const isLatestAssistant = useCallback((index: number) => {
    return chatHistory[index]?.role === 'assistant' && index === chatHistory.length - 1;
  }, [chatHistory]);

  const lastUserMessage = useMemo(() => {
    return chatHistory.slice().reverse().find(m => m.role === 'user');
  }, [chatHistory]);

  useEffect(() => {
    let currentUuid = localStorage.getItem('chat_uuid');
    if (!currentUuid) {
      currentUuid = uuidv4();
      localStorage.setItem('chat_uuid', currentUuid);
    }
    setUuid(currentUuid);

    const historyHtml = localStorage.getItem(`${currentUuid}_chat_history`);
    if (historyHtml) {
      try {
        const parsed = JSON.parse(historyHtml);
        if (Array.isArray(parsed)) setChatHistory(parsed);
      } catch {
        setChatHistory([]);
      }
    }

    setNavbarStart(localStorage.getItem('navbarStart') || '#994700');
    setNavbarEnd(localStorage.getItem('navbarEnd') || '#3a1b00');
    setAiModel(localStorage.getItem('ai_model') || 'gemini-1.5-flash');
    const savedTheme = localStorage.getItem('appearance') as 'light' | 'dark';
    setTheme(savedTheme || 'dark');
    
    // Check for quota exceeded state
    const quotaExceededTime = localStorage.getItem('quota_exceeded_time');
    if (quotaExceededTime) {
      const timeDiff = Date.now() - parseInt(quotaExceededTime);
      const remainingTime = Math.max(0, QUOTA_TIMEOUT - timeDiff);
      if (remainingTime > 0) {
        setQuotaExceeded(true);
        setQuotaTimer(Math.ceil(remainingTime / 1000));
      } else {
        localStorage.removeItem('quota_exceeded_time');
      }
    }
    
    // Event handlers
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setNoScroll(scrollHeight <= clientHeight + SCROLL_THRESHOLD);
    };

    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('appearance') as 'light' | 'dark';
      setTheme(newTheme || 'dark');
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('theme-updated', handleThemeChange);
    
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('theme-updated', handleThemeChange);
    };
  }, [uuid]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quotaExceeded && quotaTimer > 0) {
      interval = setInterval(() => {
        setQuotaTimer(prev => {
          if (prev <= 1) {
            setQuotaExceeded(false);
            localStorage.removeItem('quota_exceeded_time');
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quotaExceeded, quotaTimer]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(`${uuid}_chat_history`, JSON.stringify(chatHistory));
    }
    localStorage.setItem('navbarStart', navbarStart);
    localStorage.setItem('navbarEnd', navbarEnd);
    localStorage.setItem('ai_model', ai_model);
    document.documentElement.style.setProperty('--nav-gradient', `linear-gradient(to right, ${navbarStart}, ${navbarEnd})`);
  }, [chatHistory, navbarStart, navbarEnd, ai_model, uuid]);

  useEffect(() => {
    const scrollToBottom = () => {
      document.documentElement.scrollTo({ 
        top: document.documentElement.scrollHeight, 
        behavior: 'smooth' 
      });
    };
    
    scrollToBottom();
    
    let scrollInterval: NodeJS.Timeout | null = null;
    if (streaming) {
      scrollInterval = setInterval(scrollToBottom, 200);
    }
    
    return () => { 
      if (scrollInterval) clearInterval(scrollInterval); 
    };
  }, [chatHistory, streaming]);

  const sendMessage = useCallback(async (retryMessage?: string) => {
    if (!promptRef.current && !retryMessage) return;
    const messageText = retryMessage || promptRef.current?.value.trim() || '';
    if (!messageText) return;
    
    setLoading(true);
    setStreaming(true);
    setError(null);
    
    if (!retryMessage && promptRef.current) promptRef.current.value = '';
    setChatHistory(prev => [...prev, { role: 'user', content: messageText }]);
    
    const messages = [...chatHistory, { role: 'user', content: messageText }];
    setChatHistory(prev => [...prev, { role: 'assistant', content: '' }]);
    
    try {
      console.log('Sending request to Gemini API...');
      const url = `${GEMINI_API_BASE}${ai_model}:generateContent?key=${geminiApiKey}`;
      
      const body = {
        contents: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };
      
      console.log('Request body:', body);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      console.log('Response status:', res.status);
      
      if (res.status === 429) {
        setQuotaExceeded(true);
        setQuotaTimer(600);
        localStorage.setItem('quota_exceeded_time', Date.now().toString());
        return;
      }
      
      if (!res.ok && res.status !== 429) {
        const errorText = await res.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text && res.status !== 429) {
        const assistantText = data.candidates[0].content.parts[0].text;
        setChatHistory(prev => {
          const updated = [...prev];
          const lastIndex = updated.findIndex(m => m.role === 'assistant' && m.content === '');
          if (lastIndex !== -1) updated[lastIndex] = { role: 'assistant', content: assistantText };
          return updated;
        });
      }

      setStreaming(false);
      setLoading(false);
    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStreaming(false);
      setLoading(false);
      setChatHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.findIndex(m => m.role === 'assistant' && m.content === '');
        if (lastIndex !== -1) updated[lastIndex] = { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'An error occurred'}` };
        return updated;
      });
    }
  }, [chatHistory, ai_model, geminiApiKey]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => { 
    if (e.key === 'Enter' && !quotaExceeded) sendMessage(); 
  }, [quotaExceeded, sendMessage]);

  const handleRetry = useCallback(() => {
    if (lastUserMessage) sendMessage(lastUserMessage.content);
  }, [lastUserMessage, sendMessage]);

  const MarkdownCodeBlock = useCallback(({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1].toLowerCase() : '';
    const code = String(children).replace(/\n$/, '');
    const [copied, setCopied] = useState(false);
    const [localRenderMode, setLocalRenderMode] = useState<'syntax' | 'render'>('syntax');
    const [output, setOutput] = useState<string | null>(null);
    const [running, setRunning] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {}
    };

    const runnableLangs = [
      'javascript', 'js', 'typescript', 'ts', 'html',
      'python', 'py', 'python3'
    ];

    // Helper for online code execution
    const runOnline = async (lang: string, code: string) => {
      // For Python, use Piston API (https://piston.rs/)
      if (['python', 'py', 'python3'].includes(lang)) {
        try {
          const res = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              language: 'python3',
              version: '3.10.0',
              files: [{ name: 'main.py', content: code }]
            })
          });
          const data = await res.json();
        
          if (data.run) {
            const output = data.run.output
            if (output.trim().length > 0) return output;
            // If there is no output, but the code has print or return, show "No output." else show "Code ran successfully, but produced no output."
            if (/print\s*\(|return\s+/.test(code)) return 'No output.';
            return 'Code ran successfully, but produced no output.';
          }
          
        } catch (err: any) {
          return 'Error running Python code: ' + (err?.message || String(err));
        }
      }
      return 'Running not supported for this language.';
    };

    const handleRun = async () => {
      setRunning(true);
      setOutput(null);
      try {
        let result = '';
        if (lang === 'javascript' || lang === 'js') {
          // Try to capture console.log output
          let logs: any[] = [];
          const originalLog = console.log;
          try {
            (console as any).log = (...args: any[]) => { logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')); };
            // Try to detect if code is an expression or statement
            let evalResult;
            try {
              // Try to wrap in parentheses to allow expressions
              evalResult = await eval(`(async () => {${code}\n})()`);
            } catch {
              // If error, try as expression
              try {
                evalResult = await eval(`(async () => (${code}))()`);
              } catch (e) {
                evalResult = undefined;
              }
            }
            let outputStr = '';
            if (logs.length > 0) outputStr += logs.join('\n');
            if (evalResult !== undefined && evalResult !== null && !(typeof evalResult === 'string' && evalResult.trim() === '')) {
              if (outputStr.length > 0) outputStr += '\n';
              outputStr += typeof evalResult === 'object' ? JSON.stringify(evalResult) : String(evalResult);
            }
            if (outputStr.trim().length === 0) outputStr = 'Code ran successfully, but produced no output.';
            result = outputStr;
          } finally {
            (console as any).log = originalLog;
          }
        } else if (lang === 'typescript' || lang === 'ts') {
          const tsCode = code;
          const transpile = (window as any).ts?.transpileModule;
          if (transpile) {
            const js = transpile(tsCode, { compilerOptions: { module: 'ESNext' } }).outputText;
            // eslint-disable-next-line no-eval
            let logs: any[] = [];
            const originalLog = console.log;
            try {
              (console as any).log = (...args: any[]) => { logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')); };
              let evalResult;
              try {
                evalResult = await eval(`(async () => {${js}\n})()`);
              } catch {
                try {
                  evalResult = await eval(`(async () => (${js}))()`);
                } catch (e) {
                  evalResult = undefined;
                }
              }
              let outputStr = '';
              if (logs.length > 0) outputStr += logs.join('\n');
              if (evalResult !== undefined && evalResult !== null && !(typeof evalResult === 'string' && evalResult.trim() === '')) {
                if (outputStr.length > 0) outputStr += '\n';
                outputStr += typeof evalResult === 'object' ? JSON.stringify(evalResult) : String(evalResult);
              }
              if (outputStr.trim().length === 0) outputStr = 'Code ran successfully, but produced no output.';
              result = outputStr;
            } finally {
              (console as any).log = originalLog;
            }
          } else {
            result = 'TypeScript transpiler not loaded.';
          }
        } else if (lang === 'html') {
          const blob = new Blob([code], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          result = `<iframe src="${url}" style="width: 100%; border: none; background-color: #141414;"></iframe>`;
        } else if (['python', 'py', 'python3'].includes(lang)) {
          result = await runOnline(lang, code);
        } else {
          result = 'Running not supported for this language.';
        }
        setOutput(result);
      } catch (err: any) {
        setOutput('Error: ' + (err?.message || String(err)));
      }
      setRunning(false);
    };

    const handleAskAbout = () => {
      if (!promptRef.current) return;
      let askContent = '';
      if (output && output.startsWith('Error:')) {
        askContent = `I ran the following code and got this error:${'```'}\n${code}\n${'```'}\n\nError message:${'```'}\n${output}\n${'```'}\n\nWhat does this error mean and how can I fix it?`;
      } else if (output) {
        askContent = `\`\`\`${lang}\n${code}\n\`\`\`\n\n\`\`\`output\n${output}\n\`\`\`\n\nWhat does this mean?`;
      }
      promptRef.current.value = askContent;
      promptRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
      promptRef.current.focus();
    };

    return !inline && match ? (
      <div className="my-4 rounded-lg font-sans overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-card)] relative">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-color)] text-[var(--theme-text)] text-xs px-4 py-4">
          <Text size={'2'}>{lang}</Text>
          <div className="flex items-center gap-2">
            {lang === 'markdown' && (
              <>
                <Button size="1" variant={localRenderMode === 'syntax' ? 'solid' : 'soft'} onClick={() => setLocalRenderMode('syntax')} className="mr-1">syntax</Button>
                <Button size="1" variant={localRenderMode === 'render' ? 'solid' : 'soft'} onClick={() => setLocalRenderMode('render')} className="mr-1">render</Button>
              </>
            )}
            {runnableLangs.includes(lang) && (
              <Button size="1" variant="soft" onClick={handleRun} disabled={running} className="mr-1">{running ? 'Running...' : 'Run'}</Button>
            )}
            <IconButton onClick={handleCopy} size={'2'} variant='soft'>{copied ? <CheckIcon /> : <CopyIcon />}</IconButton>
          </div>
        </div>
        {lang === 'markdown' && localRenderMode === 'render' ? (
          <div className="p-4 bg-[var(--theme-card)]">
            <ReactMarkdown components={{ code: MarkdownCodeBlock }}>{code}</ReactMarkdown>
          </div>
        ) : (
          <div>
            <SyntaxHighlighter style={theme === 'dark' ? vscDarkPlus : prism} language={lang} customStyle={{ margin: 0, background: 'var(--theme-card)' }} {...props}>
              {code}
            </SyntaxHighlighter>
          </div>
        )}
        {output !== null && (
          <div className="m-4 rounded-lg font-sans overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-card)] relative">
            <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-color)] text-[var(--theme-text)] text-xs px-4 py-4">
              <Text size="2" weight="bold" className="mr-2">Output</Text>
              <Button size="1" variant="soft" onClick={handleAskAbout}>Ask about this</Button>
            </div>
            <div className="bg-[var(--theme-card)] h-96 rounded p-2 text-sm">
              {lang === 'html'
                ? <span dangerouslySetInnerHTML={{ __html: output }} />
                : <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
              }
            </div>
          </div>
        )}
      </div>
    ) : (
      <code {...props} className="bg-[#222] text-white rounded px-1.5 py-0.5">{children}</code>
    );
  }, [theme]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const renderMessage = useCallback((msg: {role: 'user' | 'assistant', content: string}, i: number) => {
    const isLatest = isLatestAssistant(i);
    
    return (
      <Card key={i} className={`m-2 w-fit max-w-[75%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
        <div className={`flex ${msg.role === 'user' ? 'items-center flex-row justify-end' : 'flex-row justify-start'}`}>
        {msg.role === 'assistant' && <img src={'/favicon.ico'} className='mr-2 w-10 h-10' />}
          {msg.role === 'user' ? (
            <>
              <span className='mx-2'>
                <ReactMarkdown components={{ code: MarkdownCodeBlock }}>{msg.content}</ReactMarkdown>
              </span>
              
              <Avatar fallback={localStorage.getItem('username')?.charAt(0) || 'U'} className='ml-2' radius='full' variant='soft' />
            </>
          ) : error && isLatest ? (
              <Callout.Root color="red">
                <div className='flex items-center'>
                  <Callout.Icon className='mr-2'>
                    <ExclamationTriangleIcon width='24px' height='24px' />
                  </Callout.Icon>
                  <Callout.Text>
                    {msg.content}
                    <br />
                    <Button size="2" style={{ width: '100%' }} variant='soft' color='red' onClick={handleRetry}>
                      <ReloadIcon />
                    </Button>
                  </Callout.Text>
                </div>
              </Callout.Root>
          ) : quotaExceeded && isLatest ? (
            <Callout.Root color="blue">
              <div className='flex items-center'>
                <Callout.Icon className='mr-2'>
                  <InfoCircledIcon width='24px' height='24px' />
                </Callout.Icon>
                <Callout.Text>
                  You have exceeded your current quota. Please wait {formatTime(quotaTimer)} before trying again.
                </Callout.Text>
              </div>
            </Callout.Root>
          ) : msg.role === 'assistant' ? (
            <>
              <span>
                <ReactMarkdown components={{ code: MarkdownCodeBlock }}>{msg.content}</ReactMarkdown>
              </span>
              {isLatest && streaming && (
                <span className="items-center justify-center ml-2 animate-pulse">
                  <span className="inline-block w-4 h-4 bg-white rounded-full"></span>
                </span>
              )}
            </>
          ) : null}
        </div>
      </Card>
    );
  }, [isLatestAssistant, MarkdownCodeBlock, quotaExceeded, formatTime, quotaTimer, streaming, handleRetry]);

  return (
    <>
      <Suggestions
        prompt={promptRef.current || null}
        chatHistory={chatHistory.length > 0 ? "not-null" : null}
      />
      <div
        className="flex-1 overflow-y-auto p-4 flex flex-col"
        ref={chatAreaRef}
      >
        <SignupCard chatHistory={chatHistory.length > 0 ? "not-null" : null} />
        {chatHistory.map(renderMessage)}
      </div>
      <div className={`p-4 w-full ${!noScroll ? "" : "absolute bottom-0"}`}>
        <div className="relative w-full">
          <textarea
            className="w-full overflow-hidden rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 pl-9 p-3 pr-12 text-base resize-y min-h-[48px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            placeholder={quotaExceeded ? `Rate limited. Wait ${formatTime(quotaTimer)}...` : "Message anything..."}
            ref={promptRef as unknown as React.RefObject<HTMLTextAreaElement>}
            rows={1}
            onChange={(e) => {
              const ta = e.target as HTMLTextAreaElement;
              if (ta.value.endsWith('\\n')) {
                ta.value = ta.value.slice(0, -2);
                ta.value += '\n';
                ta.style.height = "auto";
                ta.style.height = ta.scrollHeight + "px";
                ta.focus();
              } else {
                ta.style.height = "auto";
                ta.style.height = ta.scrollHeight + "px";
                ta.focus();
              }
            }}
            disabled={quotaExceeded}
            onKeyDown={(e) => {
              if (quotaExceeded) return;
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <span className="absolute left-3 mt-4 text-gray-400 pointer-events-none">
            {quotaExceeded ? <Cross1Icon /> : <ChatBubbleIcon />}
          </span>
          <span className="absolute right-3 mt-4">
            <IconButton
              size="2"
              variant="ghost"
              onClick={() => sendMessage()}
              disabled={quotaExceeded || loading}
            >
              {loading ? (
                <Spinner size="1" />
              ) : (
                <PaperPlaneIcon width="24px" height="16px" />
              )}
            </IconButton>
          </span>
        </div>
      </div>
    </>
  );
}