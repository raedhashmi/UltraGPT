'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Callout, IconButton, Link, Spinner, Text } from '@radix-ui/themes'
import { AvatarIcon, ExclamationTriangleIcon, EyeClosedIcon, EyeOpenIcon, SewingPinFilledIcon } from '@radix-ui/react-icons'

export default function loginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (usernameRef.current)
      usernameRef.current.focus()
  })

  const login = () => {
    setError(false)
    const username = usernameRef.current?.value.trim() || ''
    const password = passwordRef.current?.value.trim() || ''
    setLoading(true)
    setTimeout(() => {
      if (username == localStorage.getItem('username') && password == localStorage.getItem('password')) {
        localStorage.setItem('logged_in', 'true')
        window.location.href = '/'
      } else {
        localStorage.setItem('logged_in', 'false')
        setError(true)
        setLoading(false)
      }
    }, 1500) 
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') login()
  }

  return (
    <main>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] p-6 rounded-2xl bg-[var(--theme-card)] text-[var(--theme-text)] shadow-lg border border-[var(--theme-border)] space-y-4 text-center">
        <h1 className="text-3xl font-bold">Login</h1>

        {error && (
        <Callout.Root color='red'>
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            Incorrect username or password.
          </Callout.Text>
        </Callout.Root>
        )}
        <div className="flex items-center bg-[var(--theme-border)] rounded-md px-3 py-2">
          <AvatarIcon className="mr-2" />
          <input type="text" placeholder="Username" ref={usernameRef} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none" />
        </div>

        <div className="flex items-center bg-[var(--theme-border)] rounded-md px-3 py-2">
          <SewingPinFilledIcon className="mr-2" />
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" ref={passwordRef} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none" />
          <IconButton variant="ghost" type="button" onClick={() => setShowPassword((p) => !p)}>
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </IconButton>
        </div>
        <span className='flex ml-6'><Text size={'1'}>Don't have an account? Create one <Link href='/signup'>now</Link></Text></span>
        <br />
        <button onClick={login} disabled={loading} className={`w-full rt-BaseButton rt-r-size-2 rt-variant-solid rt-Button flex items-center ${loading ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} justify-center`} >{loading ? <Spinner size="1" /> : 'Login'}</button>
      </div>
    </main>
  )
}
