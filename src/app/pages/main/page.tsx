'use client'
import React from 'react'
import userQueryHook from '../../_hooks/_login/getUserHook'
import { Button } from '@/stories/atoms/Button';
import { authService } from '@/app/Firebase';
import { useRouter } from 'next/navigation';

const MainPage = () => {  
  const router = useRouter();
  const {data, refetch, isLoading} = userQueryHook();

  function logout () {
    authService.signOut().then(()=> {
      refetch()
      router.push("/pages/login")
    })
  }

  if(!isLoading) {
    if (!data) {
      router.push("/pages/login")
    }
  } 

  return (
    <Button width={200} height={50} theme='success' fontSize={18} onClick={logout}>로그아웃</Button>
  )
}

export default MainPage
