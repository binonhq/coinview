import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/Home'
import { PortfolioPage } from './pages/Portfolio'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
