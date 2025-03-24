// src/App.tsx
import { Routes, Route } from "react-router-dom"
import Layout from "@/layout/Layout"
import Home from "@/pages/Home"
import Stats from "@/pages/Stats"
import Settings from "@/pages/Settings"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
