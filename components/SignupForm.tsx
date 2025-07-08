'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Callout, IconButton, Link, Spinner, Text } from '@radix-ui/themes'
import { AvatarIcon, ExclamationTriangleIcon, EyeClosedIcon, EyeOpenIcon, SewingPinFilledIcon } from '@radix-ui/react-icons'

export default function signupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (usernameRef.current)
      usernameRef.current.focus()
  })

  const signup = () => {
    setError(false)
    const username = usernameRef.current?.value.trim() || ''
    const password = passwordRef.current?.value.trim() || ''
    setLoading(true)
    setTimeout(() => {
      if (username == localStorage.getItem('username') && password == localStorage.getItem('password')) {
        setError(true)
        setLoading(false)
      } else if (username && password && username != localStorage.getItem('username') && password != localStorage.getItem('password')) {
        setError(false)
        setLoading(true)
        localStorage.setItem('username', username)
        localStorage.setItem('password', password)
        localStorage.setItem('logged_in', 'false')
        window.location.href = '/login'
      }
    }, 1500) 
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') signup()
  }

  return (
    <main>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] p-6 rounded-2xl shadow-lg border border-stone-700 space-y-4 text-center" style={{ background: 'var(--themecard)' }}>
        <h1 className="text-3xl font-bold">Sign Up</h1>

        {error && (
        <Callout.Root color='red'>
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            Please fill out all fields or an account already exsists with that name.
          </Callout.Text>
        </Callout.Root>
        )}
        <div className="flex items-center bg-white/10 rounded-md px-3 py-2">
          <AvatarIcon className="mr-2" />
          <input type="text" placeholder="Username" ref={usernameRef} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none" />
        </div>

        <div className="flex items-center bg-white/10 rounded-md px-3 py-2">
          <SewingPinFilledIcon className="mr-2" />
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" ref={passwordRef} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none" />
          <IconButton variant="ghost" type="button" onClick={() => setShowPassword((p) => !p)}>
            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </IconButton>
        </div>
        <span className='flex ml-6'><Text size={'1'}>Already have an account? Log in to it <Link href='/login'>now</Link></Text></span>
        <br />
        <button onClick={signup} disabled={loading} className={`w-full rt-BaseButton rt-r-size-2 rt-variant-solid rt-Button flex items-center ${loading ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} justify-center`} >{loading ? <Spinner size="1" /> : 'Sign Up'}</button>
      </div>
    </main>
  )
}
