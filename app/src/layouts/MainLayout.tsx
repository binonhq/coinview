import { Footer } from '@/components/Footer'
import { HeaderBar } from '@/components/HeaderBar'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br antialiased flex flex-col bg-primary text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-green-300/10 blur-[100px]" />
        <div className="lg:visible invisible absolute bottom-0 left-0 h-[200px] w-[200px] lg:h-[500px] lg:w-[500px] bg-green-300/10 blur-[100px]" />
      </div>
      <HeaderBar />
      <Outlet />
      <Footer />
    </div>
  )
}
