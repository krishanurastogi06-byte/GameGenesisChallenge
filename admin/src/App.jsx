import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'))

  const handleLogin = (t) => {
    localStorage.setItem('adminToken', t)
    setToken(t)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
  }

  return token ? <Dashboard token={token} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
}

export default App
