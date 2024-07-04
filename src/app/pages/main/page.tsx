'use client'
import React, { useEffect } from 'react'
import userQueryHook from '../login/getUserHook';
import { useRouter } from 'next/navigation';
const MainPage = () => {
 const { data } = userQueryHook(); 
  const router = useRouter();

  useEffect(()=>{
    if(data) {
      router.push('/pages/main')
    } else {
      router.push('/pages/login')
    }
  },[])
  
  return (
    <div>
     메인
    </div>
  )
}

export default MainPage
