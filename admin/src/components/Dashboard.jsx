import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, CheckCircle, Code, Shield, RefreshCw, LogOut, Trash2, RotateCcw, Trophy, AlertTriangle, Clock, Terminal, Activity, Cpu } from 'lucide-react'

function timeDisplay(d) {
  if (!d) return '-'
  try { return new Date(d).toLocaleString() } catch { return d }
}

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, boxShadow: "0 0 20px rgba(0, 210, 255, 0.2)" }}
    className="glass-card p-6 rounded-2xl border border-gaming-blue/10 flex items-center gap-4 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-2 opacity-5">
      <Icon size={80} />
    </div>
    <div className={`p-4 rounded-xl bg-gaming-blue/10 border border-gaming-blue/20 shadow-neon`}>
      <Icon size={24} className="text-gaming-blue" />
    </div>
    <div className="relative z-10">
      <p className="text-[10px] text-gaming-blue/50 font-black uppercase tracking-widest mb-1">{title}</p>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-3xl font-black text-white tracking-tighter neon-text"
      >
        {value}
      </motion.p>
    </div>
  </motion.div>
)

export default function Dashboard({ token, onLogout }) {
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    if (!teams.length) setLoading(true)
    setError(null)
    try {
      const [lbRes, statsRes] = await Promise.all([
        fetch('/api/admin/leaderboard', { headers: { 'authorization': `Bearer ${token}` } }),
        fetch('/api/admin/stats', { headers: { 'authorization': `Bearer ${token}` } })
      ])
      if (!lbRes.ok) throw new Error('Failed to load leaderboard')
      const lb = await lbRes.json()
      const st = statsRes.ok ? await statsRes.json() : null
      setTeams(lb)
      setStats(st)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const id = setInterval(() => fetchData(false), 5000)
    return () => clearInterval(id)
  }, [])

  const resetTeam = async (teamId) => {
    if (!confirm('Reset this team?')) return
    try {
      const res = await fetch(`/api/teams/${teamId}/terminate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Reset failed')
      await fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const deleteTeam = async (teamId) => {
    if (!confirm('Delete this team permanently? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/admin/team/${teamId}`, {
        method: 'DELETE',
        headers: { 'authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Delete failed')
      setTeams(prev => prev.filter(t => t._id !== teamId))
    } catch (err) {
      alert(err.message)
    }
  }

  const terminatedTeams = teams.filter(t => t.isTerminated)
  const finishers = teams
    .filter(t => t.rank && !t.isTerminated)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div className="min-h-screen bg-gaming-black gaming-gradient pb-20 text-white font-sans">
      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0, 210, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 255, 0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gaming-black/60 backdrop-blur-xl border-b border-gaming-blue/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              className="bg-gaming-blue/10 p-2.5 rounded-xl border border-gaming-blue/30 shadow-neon"
            >
              <Terminal size={24} className="text-gaming-blue" />
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic neon-text">
                GameGenesis <span className="text-gaming-blue">OS v2.0</span>
              </h1>
              <p className="text-[10px] text-gaming-blue/50 font-bold uppercase tracking-[0.3em]">Administrator Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fetchData(true)}
              className={`p-3 rounded-xl bg-gaming-blue/5 border border-gaming-blue/20 text-gaming-blue transition-colors ${refreshing ? 'animate-spin shadow-neon' : 'hover:bg-gaming-blue/10'}`}
              title="Refresh Uplink"
            >
              <RefreshCw size={20} />
            </motion.button>
            <div className="h-8 w-px bg-gaming-blue/20 mx-2" />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all font-black text-xs uppercase tracking-widest"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Terminate Session</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-10 relative z-10">
        {/* Stats Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard title="Active Operatives" value={stats?.totalTeams ?? 0} icon={Users} delay={0.1} />
          <StatCard title="Mission Complete" value={stats?.finishedTeams ?? 0} icon={CheckCircle} delay={0.2} />
          <StatCard title="Cyber Division" value={stats?.pathDistribution?.Cyber ?? 0} icon={Shield} delay={0.3} />
          <StatCard title="Dev Division" value={stats?.pathDistribution?.Dev ?? 0} icon={Code} delay={0.4} />
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Top Finishers - Hall of Fame */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center gap-3">
              <Trophy size={24} className="text-yellow-500 shadow-neon" />
              <h2 className="text-lg font-black uppercase italic tracking-widest neon-text">Apex Performers</h2>
            </div>
            <div className="glass-card rounded-2xl border-gaming-blue/20 overflow-hidden">
              {finishers.length === 0 ? (
                <div className="p-12 text-center text-gaming-blue/30 italic uppercase tracking-widest text-sm bg-gaming-black/40">No records found in database</div>
              ) : (
                <div className="divide-y divide-gaming-blue/10">
                  {finishers.map((t, i) => (
                    <motion.div
                      key={t._id}
                      whileHover={{ backgroundColor: "rgba(0, 210, 255, 0.05)" }}
                      className="p-6 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border-2 ${i === 0 ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' :
                          i === 1 ? 'bg-slate-400/10 border-slate-400/50 text-slate-400' :
                            'bg-amber-600/10 border-amber-600/50 text-amber-600'
                          }`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-lg font-black text-white uppercase tracking-tight">{t.teamName}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] text-gaming-blue/50 font-bold uppercase flex items-center gap-1.5">
                              <Clock size={12} /> {timeDisplay(t.endTime)}
                            </span>
                            <span className="text-[10px] bg-gaming-blue/10 text-gaming-blue px-2 py-0.5 rounded border border-gaming-blue/20 font-black uppercase">
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Activity size={24} className="text-gaming-blue/20" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Terminated Teams - Quarantine */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-red-500 shadow-neon" />
              <h2 className="text-lg font-black uppercase italic tracking-widest text-red-500">Quarantine</h2>
            </div>
            <div className="glass-card rounded-2xl border-red-500/20 p-4 max-h-[400px] overflow-auto bg-red-500/5">
              {terminatedTeams.length === 0 ? (
                <div className="py-12 text-center text-red-500/30 italic text-sm uppercase tracking-widest font-bold">Quarantine clear</div>
              ) : (
                <div className="space-y-4">
                  {terminatedTeams.map(t => (
                    <motion.div
                      key={t._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gaming-black/60 border border-red-500/20 rounded-xl relative group hover:border-red-500/40 transition-all"
                    >
                      <p className="font-black text-red-400 text-sm uppercase tracking-tighter">{t.teamName}</p>
                      <div className="mt-2 text-[10px] text-red-500/60 font-bold uppercase space-y-1">
                        <p>ID: {t.leaderName}</p>
                        <p className="flex justify-between">
                          <span>Lv {t.levelCode || '0'}</span>
                          <span className="bg-red-500/10 px-1.5 rounded">{t.path}</span>
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2, color: "#f87171" }}
                        onClick={() => deleteTeam(t._id)}
                        className="absolute right-3 top-3 p-1.5 text-red-500/40 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Global Teams Table - Master Roster */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu size={24} className="text-gaming-blue" />
              <h2 className="text-lg font-black uppercase italic tracking-widest neon-text">Master Roster</h2>
            </div>
            <div className="text-[10px] font-bold text-gaming-blue/40 uppercase tracking-[0.2em]">Enforcement Mode: Active</div>
          </div>

          <div className="glass-card rounded-2xl border-gaming-blue/20 overflow-hidden">
            {loading ? (
              <div className="p-32 flex flex-col items-center justify-center gap-6">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 border-4 border-gaming-blue/10 border-t-gaming-blue rounded-full shadow-neon"
                />
                <p className="text-gaming-blue font-black uppercase tracking-[0.4em] animate-pulse text-xs">Decrypting Records...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gaming-blue/5 border-b border-gaming-blue/20">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gaming-blue uppercase tracking-[0.2em]">Operative Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gaming-blue uppercase tracking-[0.2em]">Progression Matrix</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gaming-blue uppercase tracking-[0.2em]">Mission Timeline</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gaming-blue uppercase tracking-[0.2em]">Status Code</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gaming-blue uppercase tracking-[0.2em] text-right">Action Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gaming-blue/5 bg-gaming-black/20">
                    <AnimatePresence>
                      {teams.map((t) => (
                        <motion.tr
                          key={t._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ backgroundColor: "rgba(0, 210, 255, 0.02)" }}
                          className={`transition-colors group ${t.isTerminated ? 'opacity-40 grayscale' : ''}`}
                        >
                          <td className="px-8 py-6">
                            <div>
                              <div className="font-black text-white uppercase tracking-tight flex items-center gap-3">
                                {t.teamName}
                                {t.rank && (
                                  <span className="text-[9px] bg-gaming-blue text-gaming-black px-2 py-0.5 rounded font-black italic shadow-neon">
                                    RANK {t.rank}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gaming-blue/60 font-bold mt-1 uppercase tracking-widest">
                                Lead: {t.leaderName}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="px-2.5 py-1 bg-gaming-blue/10 text-gaming-blue rounded border border-gaming-blue/30 font-mono text-[10px] font-black shadow-neon">
                                LEVEL {t.levelCode || '00'}
                              </div>
                              <span className="text-[10px] font-black text-white/70 uppercase italic tracking-widest">{t.path || 'SCANNING...'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-[9px] font-bold uppercase tracking-widest space-y-1.5">
                              <div className="text-white/40"><span className="text-gaming-blue/60 border-l border-gaming-blue/30 pl-2 ml-1">IN:</span> {timeDisplay(t.startTime)}</div>
                              <div className="text-white/40"><span className="text-gaming-blue/60 border-l border-gaming-blue/30 pl-2 ml-1">OUT:</span> {timeDisplay(t.endTime)}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {t.isTerminated ? (
                              <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.1em]">Quarantined</span>
                            ) : t.isFinished ? (
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.1em]">Objective Met</span>
                            ) : (
                              <span className="px-3 py-1 bg-gaming-blue/20 text-gaming-blue border border-gaming-blue/30 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-neon animate-pulse">In-Field</span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                              {!t.isTerminated && !t.isFinished && (
                                <motion.button
                                  whileHover={{ scale: 1.1, color: "#fb923c" }}
                                  onClick={() => resetTeam(t._id)}
                                  className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400/60 rounded-lg transition-all"
                                  title="Protocol: Reset"
                                >
                                  <RotateCcw size={16} />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1, color: "#f87171" }}
                                onClick={() => deleteTeam(t._id)}
                                className="p-2 bg-red-500/10 border border-red-500/20 text-red-400/60 rounded-lg transition-all"
                                title="Protocol: Delete"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-20 border-t border-gaming-blue/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <div className="flex gap-4">
            <div className="w-1 h-8 bg-gaming-blue/50" />
            <div className="text-[10px] font-bold uppercase tracking-[0.5em]">System Status: Operational</div>
          </div>
          <div className="text-[8px] font-black uppercase tracking-[1em]">Secure Transmission // encrypted</div>
        </div>
      </footer>
    </div>
  )
}


