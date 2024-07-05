'use client'
import React from 'react'
import userQueryHook from '../login/getUserHook'
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
      <div>
        메인
        <Button width="70" size="small" theme='success' onClick={logout}>로그아웃</Button>
      </div> 
  )
}

export default MainPage
