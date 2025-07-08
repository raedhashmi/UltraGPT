"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { Button, Tooltip, Text, IconButton, Avatar, Dialog, Flex, Tabs, Heading, Callout, Spinner, Switch, TextField, Badge, Card, Separator, DropdownMenu, RadioGroup } from "@radix-ui/themes";
import { AvatarIcon, Cross1Icon, ExclamationTriangleIcon, EyeClosedIcon, EyeOpenIcon, SewingPinFilledIcon } from '@radix-ui/react-icons';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState<any>()
  const [usernameFirstLetter, setUsernameFirstLetter] = useState<any>()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [ai_model, setAiModel] = useState('gpt-3.5-turbo')
  const [username, setUsername] = useState<any>()
  const [password, setPassword] = useState<any>()
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [accent, setAccent] = useState('orange');
  const [background, setBackground] = useState('sage');
  const [appearance, setAppearance] = useState<'light' | 'dark'>('dark');
  const [navbarStart, setNavbarStart] = useState('#994700');
  const [navbarEnd, setNavbarEnd] = useState('#3a1b00');

  useEffect(() => {
    setUsernameFirstLetter(localStorage.getItem('username')?.toString().charAt(0) ?? '?')
    setLoggedIn(localStorage.getItem('logged_in') ?? 'false')
    setDarkMode(localStorage.getItem('theme') === 'dark')
    setAiModel(localStorage.getItem('ai_model') ?? 'gpt-3.5-turbo')
    setUsername(localStorage.getItem('username'))
    setPassword(localStorage.getItem('password'))
    setAccent(localStorage.getItem('accent') || 'orange');
    setBackground(localStorage.getItem('background') || 'sage');
    setAppearance((localStorage.getItem('appearance') as 'light' | 'dark') || 'dark');
    setNavbarStart(localStorage.getItem('navbarStart') || '#994700');
    setNavbarEnd(localStorage.getItem('navbarEnd') || '#3a1b00');
  }, [])

  useEffect(() => {
    localStorage.setItem('accent', accent);
    localStorage.setItem('background', background);
    localStorage.setItem('appearance', appearance);
    localStorage.setItem('navbarStart', navbarStart);
    localStorage.setItem('navbarEnd', navbarEnd);
    document.documentElement.style.setProperty(
      '--nav-gradient',
      `linear-gradient(to right, ${navbarStart}, ${navbarEnd})`
    );
    window.dispatchEvent(new Event('theme-updated'));
  }, [accent, background, appearance, navbarStart, navbarEnd]);

  const changeinfo = () => {
    setError(false)
    const username = usernameRef.current?.value.trim() || ''
    const password = passwordRef.current?.value.trim() || ''
    setLoading(true)
    setTimeout(() => {
      if (username == localStorage.getItem('username') && password == localStorage.getItem('password')) {
        setError(false)
        setSuccess(true)
        setLoading(false)
      } else if (username && password && username !== localStorage.getItem('username') && password !== localStorage.getItem('password')) {
        setError(false)
        setLoading(false)
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        setSuccess(true)
      } else {
        setError(true)
        setLoading(false)
      }
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') changeinfo()
  }

  const handleModelChange = (value: string) => {
    setAiModel(value)
    localStorage.setItem('ai_model', value)
  }

  if (loggedIn == 'false') {
    return (
      <main>
        <nav className="flex items-center px-6 py-4 text-white" style={{ background: 'var(--nav-gradient, linear-gradient(to right, #994700, #3a1b00))' }}>
          <img src="/favicon.ico" className="w-14 h-auto mx-2 mr-3" />
          <Text weight={'bold'} size={'5'}>UltraGPT</Text>
          <span className="ml-2 -mt-1"><Text size={'1'}>By <Link href="https://github.com/raedhashmi/" className="font-mono">raedhashmi</Link></Text></span>

          <Tooltip content="Log In"><span className="mr-3 ml-auto hover:scale-110 transform transition"><Button onClick={() => window.location.href = '/login'}>Log In</Button></span></Tooltip>
          <Tooltip content="Sign Up"><span className="hover:scale-110 transform transition"><Button onClick={() => window.location.href = '/signup'}>Sign Up</Button></span></Tooltip>
        </nav>
      </main>
    );
  } else {
    return (
      <main>
        <nav className="flex items-center px-6 py-4 text-white" style={{ background: 'var(--nav-gradient, linear-gradient(to right, #994700, #3a1b00))' }}>
          <img src="/favicon.ico" className="w-14 h-auto mx-2 mr-3" />
          <Text weight={'bold'} size={'5'}>UltraGPT</Text>
          <span className="ml-2 -mt-1"><Text size={'1'}>By <Link href="https://github.com/raedhashmi/" className="font-mono">raedhashmi</Link></Text></span>

          <Dialog.Root>
            <Tooltip content="Account Settings">
              <span className="ml-auto hover:scale-110 transform transition">
                <Dialog.Trigger><IconButton variant='ghost' size={'1'} radius='full'><Avatar radius='full' size={'3'} fallback={`${usernameFirstLetter}`} /></IconButton></Dialog.Trigger>
              </span>
            </Tooltip>
            <Dialog.Title></Dialog.Title>
            <Dialog.Content height={'500px'} maxWidth={'1200px'} className="relative">
              <Dialog.Close>
                <span className="absolute top-7 right-4">
                  <IconButton variant="ghost"><Cross1Icon /></IconButton>
                </span>
              </Dialog.Close>

              <Tabs.Root defaultValue="account">
                <Tabs.List size="2" className="mb-4">
                  <Tabs.Trigger value="account">Account</Tabs.Trigger>
                  <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
                  <Tabs.Trigger value="aimodels">AI Models</Tabs.Trigger>
                  <Tabs.Trigger value="dangerzone">Danger Zone</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="account">
                  <div className='space-y-4 p-8'>
                    <Heading>Change credentials</Heading>
                    <br />
                    {error ?
                      <Callout.Root color='red'>
                        <Callout.Icon>
                          <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>
                          Please fill out all fields or an account already exsists with that name.
                        </Callout.Text>
                      </Callout.Root>
                      : ''}
                    {success ?
                      <Callout.Root color='green'>
                        <Callout.Icon>
                          <ExclamationTriangleIcon />
                        </Callout.Icon>
                        <Callout.Text>
                          Your credentials were saved successfully!
                        </Callout.Text>
                      </Callout.Root>
                      : ''}
                    <div className="flex items-center bg-stone- rounded-md px-3 py-2 border border-stone-">
                      <AvatarIcon className="mr-2" />
                      <input type="text" placeholder="Username" defaultValue={username} ref={usernameRef} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none" />
                    </div>

                    <div className="flex items-center bg-stone- rounded-md px-3 py-2 border border-stone-">
                      <SewingPinFilledIcon className="mr-2" />
                      <input type={showPassword ? 'text' : 'password'} defaultValue={password} placeholder="Password" ref={passwordRef} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none" />
                      <IconButton variant="ghost" type="button" onClick={() => setShowPassword((p) => !p)}>
                        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                      </IconButton>
                    </div>
                    <br />
                    <button onClick={changeinfo} disabled={loading} className={`w-full rt-BaseButton rt-r-size-2 rt-variant-solid rt-Button flex items-center ${loading ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} justify-center`} >{loading ? <Spinner size="1" /> : 'Update Info'}</button>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="theme">
                  <div className="space-y-6 p-6">
                    <Heading size="5" mb="4">Theme Settings</Heading>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mb-2">
                      <Text as="label" size="3" className="w-40">Accent Color:</Text>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="soft" color={(
                            ["orange", "gold", "bronze", "brown", "yellow", "lime", "green", "teal", "cyan", "blue", "indigo", "purple", "pink", "red", "ruby", "crimson"].includes(accent)
                              ? accent
                              : "orange"
                          ) as any}>{accent.charAt(0).toUpperCase() + accent.slice(1)}</Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          {["orange", "gold", "bronze", "brown", "yellow", "lime", "green", "teal", "cyan", "blue", "indigo", "purple", "pink", "red", "ruby", "crimson"].map(opt => (
                            <DropdownMenu.Item key={opt} onSelect={() => setAccent(opt)}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mb-2">
                      <Text as="label" size="3" className="w-40">Background Color:</Text>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="soft" color="gray">{background.charAt(0).toUpperCase() + background.slice(1)}</Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          {["sage", "olive", "sand", "tomato", "gray", "mauve"].map(opt => (
                            <DropdownMenu.Item key={opt} onSelect={() => setBackground(opt)}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</DropdownMenu.Item>
                          ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mb-2">
                      <Text as="label" size="3" className="w-40">Appearance:</Text>
                      <Switch checked={appearance === 'dark'} onCheckedChange={checked => setAppearance(checked ? 'dark' : 'light')} />
                      <Text size="3">{appearance.charAt(0).toUpperCase() + appearance.slice(1)}</Text>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2 mb-2">
                      <Text as="label" size="3" className="w-40">Navbar Gradient:</Text>
                      <div className="flex items-center gap-2">
                        <input type="color" value={navbarStart} onChange={e => setNavbarStart(e.target.value)} />
                        <span>→</span>
                        <input type="color" value={navbarEnd} onChange={e => setNavbarEnd(e.target.value)} />
                      </div>
                    </div>
                    <Separator my="4" size="4" />
                  </div>
                </Tabs.Content>

                <Tabs.Content value="aimodels">
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-bold">Select AI Model</h3>
                    <p className="text-sm text-var(--theme-border)">Pick the model you'd like to use for chat completion.</p>
                    <RadioGroup.Root value={ai_model} onValueChange={handleModelChange} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.7rem' }}>
                      {[
                        ['gpt-3.5'],
                        ['gpt-3.5-turbo'],
                        ['gpt-3.5-turbo-0125'],
                        ['gpt-3.5-turbo-1106'],
                        ['gpt-3.5-turbo-16k'],
                        ['grok-1'],
                        ['grok-1.5'],
                        ['grok-1.5v'],
                        ['grok-2'],                        
                      ].map(([model]) => (
                        <RadioGroup.Item key={model} value={model} style={{ width: '100%' }} className={`items-center p-4 rounded-lg border transition cursor-pointer ${ai_model === model ? 'border-[var(--accent-a11)] bg-[var(--theme-card)] ring-1 ring-[var(--accent-a11)]' : 'border-[var(--theme-border)] bg-[var(--theme-card)] hover:border-[var(--accent-a11)]'}`}>
                          <div>
                            <span className="font-bold text-[var(--theme-text)]">{model}</span>
                          </div>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="dangerzone">
                  <div className="p-6 space-y-4 text-left text-sm">
                    <Callout.Root color="red">
                      <Callout.Icon>
                        <ExclamationTriangleIcon />
                      </Callout.Icon>
                      <Callout.Text>
                        <Text weight="bold">Danger Zone:</Text> These actions cannot be undone. Proceed with caution.
                      </Callout.Text>
                    </Callout.Root>
                    <div className="flex flex-col gap-2 w-full">
                      <Button color="red" mb={'2'} variant="soft" className="w-full !block" style={{ width: "100%" }} onClick={() => { localStorage.removeItem(`${localStorage.getItem('chat_uuid')}_chat_history`); window.location.reload(); }}>Clear Chat History</Button>
                      <Button color="ruby" variant="soft" className="w-full !block" style={{ width: "100%" }} onClick={() => { localStorage.clear(); window.location.reload(); }}>Delete Account</Button>
                    </div>
                  </div>
                </Tabs.Content>

              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Root>
        </nav>
      </main>
    );
  }
}