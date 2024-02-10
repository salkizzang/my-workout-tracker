"use client"
import App from '@/components/App'
import Image from 'next/image'
import { RecoilRoot } from 'recoil'

export default function Home() {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )
}
