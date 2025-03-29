import { Link } from 'react-router-dom'
// import { Button } from '@/components/ui/button'

export const HeaderBar = () => {
  return (
    <header className="sticky top-0 py-10 w-full z-40 text-white border-b flex items-center bg-background/80 backdrop-blur-md border-white/10 px-[5vw]">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl">
        <span className="text-3xl bg-gradient-to-r from-blue-400 to-secondary inline-block text-transparent bg-clip-text">
          CoinView
        </span>
      </Link>
      {/* <nav className="ml-auto flex gap-2">
        <Link to="/portfolio">
          <Button
            className="rounded-full font-bold"
            size="lg"
            variant="outline"
          >
            My Portfolio
          </Button>
        </Link>
      </nav> */}
    </header>
  )
}
