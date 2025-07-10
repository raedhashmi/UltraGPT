import { Card, Text, Link } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'

export default function SignupCard() {
  let [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('logged_in') === 'true';
    const uuid = localStorage.getItem('chat_uuid');
    const history = localStorage.getItem(`${uuid}_chat_history`);
    setShowSignup(!loggedIn && !!history && history !== '');
  }, [])
  return (
    <Card hidden={!showSignup} className='relative left-1/2 transform -translate-x-1/2 w-fit'>
      <Text size={'3'} weight={'medium'}>Sign Up to get the latest and fastest models.</Text>
      <br />
      <span className='ml-14'><Text size={'1'}>Don't have an account? Create one <Link href='/signup'>now</Link></Text></span>
    </Card>
  )
}
