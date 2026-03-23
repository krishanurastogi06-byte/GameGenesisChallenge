import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, User, LogIn, AlertCircle, ShieldCheck } from 'lucide-react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg || 'Login failed')
      onLogin(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-black gaming-gradient relative overflow-hidden p-4">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(0, 210, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gaming-blue/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gaming-dark-blue/20 rounded-full blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 rounded-2xl shadow-neon border-gaming-blue/30">
          <div className="text-center mb-10">
            <motion.div
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-20 h-20 bg-gaming-blue/10 border border-gaming-blue/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-neon"
            >
              <ShieldCheck className="text-gaming-blue w-10 h-10 neon-text" />
            </motion.div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter neon-text uppercase italic">
              Command <span className="text-gaming-blue">Center</span>
            </h2>
            <div className="h-1 w-20 bg-gaming-blue mx-auto rounded-full mb-4 shadow-neon" />
            <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">Authorization Required</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm italic"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gaming-blue/70 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gaming-blue transition-colors">
                  <User size={18} />
                </div>
                <input
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="AGENT USERNAME"
                  className="w-full bg-gaming-black/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gaming-blue/50 focus:border-gaming-blue transition-all placeholder:text-gray-600 font-mono text-sm tracking-wider"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gaming-blue/70 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gaming-blue transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gaming-black/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gaming-blue/50 focus:border-gaming-blue transition-all placeholder:text-gray-600 font-mono text-sm tracking-wider"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 210, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-4 px-6 bg-gaming-blue hover:bg-gaming-blue/90 text-gaming-black font-black uppercase tracking-widest rounded-xl shadow-neon transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-gaming-black/30 border-t-gaming-black rounded-full"
                />
              ) : (
                <>
                  <LogIn size={20} />
                  Initiate Session
                </>
              )}
            </motion.button>
          </form>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gaming-blue/30 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          &copy; {new Date().getFullYear()} GameGenesis Challenge // Secure Access Protocol
        </motion.p>
      </motion.div>
    </div>
  )
}


