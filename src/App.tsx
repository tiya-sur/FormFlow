import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  AlertCircle,
  ArrowRightLeft,
  MapPin,
  Maximize2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Stats, Site, MarketplaceSuggestion, Panel } from './types';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'dashboard', label: 'Fleet Overview', icon: LayoutDashboard },
    { id: 'optimizer', label: 'AI Optimizer', icon: Cpu },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'inventory', label: 'RFID Tracking', icon: Package },
  ];

  return (
    <div className="w-64 h-screen border-r border-brand-primary/10 flex flex-col p-6 fixed left-0 top-0 bg-brand-secondary">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
          <TrendingUp className="text-brand-secondary" size={24} />
        </div>
        <h1 className="font-mono font-bold text-xl tracking-tighter">FORMFLOW</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-primary text-brand-secondary' 
                : 'hover:bg-brand-primary/5 text-brand-primary/60 hover:text-brand-primary'
            }`}
          >
            <tab.icon size={20} />
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-brand-primary/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-accent/10">
          <Zap className="text-brand-accent" size={18} />
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-brand-accent">AI Status</p>
            <p className="text-xs font-mono">Optimization Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subtext, icon: Icon }: any) => (
  <div className="p-6 rounded-2xl border border-brand-primary/5 bg-white/50 backdrop-blur-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-brand-primary/5">
        <Icon size={20} className="text-brand-primary" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Real-time</span>
    </div>
    <h3 className="text-3xl font-mono font-bold mb-1">{value}</h3>
    <p className="text-sm font-medium text-brand-primary/60">{label}</p>
    <p className="text-xs mt-2 text-emerald-600 font-bold">{subtext}</p>
  </div>
);

const Dashboard = ({ stats }: { stats: Stats | null }) => {
  const chartData = [
    { name: 'Jan', reuse: 15, waste: 25 },
    { name: 'Feb', reuse: 18, waste: 22 },
    { name: 'Mar', reuse: 22, waste: 18 },
    { name: 'Apr', reuse: 28, waste: 12 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Waste Reduced" value={stats?.totalWasteReduced || '0%'} subtext="+12% from last month" icon={AlertCircle} />
        <StatCard label="Avg Reuse Cycles" value={stats?.avgReuseCycles || 0} subtext="Target: 35 cycles" icon={ArrowRightLeft} />
        <StatCard label="Cost Savings" value={stats?.costSavings || '₹0'} subtext="Portfolio-wide" icon={TrendingUp} />
        <StatCard label="Active Sites" value={stats?.activeSites || 0} subtext="Across 4 regions" icon={MapPin} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-brand-primary/5 shadow-sm">
          <h3 className="font-mono font-bold text-lg mb-6 flex items-center gap-2">
            <TrendingUp size={20} /> REUSE VS WASTE TREND
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReuse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="reuse" stroke="#F27D26" fillOpacity={1} fill="url(#colorReuse)" strokeWidth={3} />
                <Area type="monotone" dataKey="waste" stroke="#141414" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-brand-primary text-brand-secondary shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-mono font-bold text-lg mb-6">FLEET UTILIZATION</h3>
            <div className="space-y-6">
              {[
                { label: 'Standard Wall Panels', value: 82, color: 'bg-brand-accent' },
                { label: 'Slab Formwork', value: 64, color: 'bg-emerald-500' },
                { label: 'Column Sets', value: 45, color: 'bg-blue-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="opacity-60">{item.label}</span>
                    <span className="font-mono font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-4 bg-white text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-accent hover:text-white transition-colors">
              VIEW DETAILED INVENTORY
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-accent/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

const Optimizer = () => {
  const [loading, setLoading] = useState(false);
  const [nudges, setNudges] = useState<any[]>([]);
  const [context, setContext] = useState('');

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
      });
      const data = await res.json();
      setNudges(data.nudges);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-8 rounded-3xl bg-white border border-brand-primary/5">
          <h3 className="font-mono font-bold text-lg mb-6 flex items-center gap-2">
            <Maximize2 size={20} /> BIM GEOMETRY PARSER
          </h3>
          <div className="aspect-video bg-brand-secondary rounded-2xl border-2 border-dashed border-brand-primary/10 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-brand-primary/5 rounded-full flex items-center justify-center mb-4">
              <Package className="text-brand-primary/40" size={32} />
            </div>
            <p className="font-medium text-brand-primary/60 mb-4">Drag & Drop Revit (RVT) or IFC files here</p>
            <input 
              type="text" 
              placeholder="Or describe project specs (e.g. 30-story residential, 2.8m floor height)"
              className="w-full max-w-md px-4 py-3 rounded-xl border border-brand-primary/10 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <button 
              onClick={handleOptimize}
              disabled={loading}
              className="mt-6 px-8 py-3 bg-brand-primary text-brand-secondary rounded-xl font-bold text-sm hover:bg-brand-accent transition-all disabled:opacity-50"
            >
              {loading ? 'RUNNING GENETIC ALGORITHM...' : 'RUN OPTIMIZER'}
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-brand-primary/5">
          <h3 className="font-mono font-bold text-lg mb-6">POUR SEQUENCING SIMULATION</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${
                  i % 4 === 0 ? 'bg-brand-accent text-white' : 'bg-brand-secondary text-brand-primary/40'
                }`}
              >
                P{i+1}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-accent" /> Active Pour</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-secondary" /> Idle/Curing</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-brand-accent text-white shadow-lg">
          <h4 className="font-mono font-bold text-sm mb-4 flex items-center gap-2">
            <Zap size={16} /> AI DESIGN NUDGES
          </h4>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-4 py-8 text-center"
              >
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm opacity-80">Analyzing BIM geometry for reuse patterns...</p>
              </motion.div>
            ) : nudges.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {nudges.map((nudge, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/10 border border-white/20">
                    <p className="font-bold text-sm mb-1">{nudge.title}</p>
                    <p className="text-xs opacity-80 mb-2">{nudge.description}</p>
                    <div className="text-[10px] font-mono font-bold bg-white/20 inline-block px-2 py-1 rounded">
                      EST. SAVINGS: {nudge.estimatedSavings}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="py-8 text-center opacity-60 italic text-sm">
                Run optimizer to see AI-driven design suggestions.
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-brand-primary/5">
          <h4 className="font-mono font-bold text-sm mb-4">OPTIMIZATION METRICS</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-primary/60">Panel Mismatch</span>
              <span className="text-xs font-bold text-emerald-600">-42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-primary/60">Cut Panels</span>
              <span className="text-xs font-bold text-emerald-600">-15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-brand-primary/60">Idle Stock</span>
              <span className="text-xs font-bold text-emerald-600">-30%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Marketplace = ({ suggestions }: { suggestions: MarketplaceSuggestion[] }) => {
  return (
    <div className="space-y-8">
      <div className="p-8 rounded-3xl bg-white border border-brand-primary/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-mono font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={20} /> CROSS-SITE REDISTRIBUTION
          </h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">4 New Suggestions</span>
          </div>
        </div>

        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-brand-primary/5 hover:border-brand-accent/30 transition-all flex flex-col md:flex-row items-center gap-6 group"
            >
              <div className="flex-1 flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest mb-1">From</p>
                  <p className="font-bold">{s.from}</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-brand-secondary text-brand-primary/40 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  <ArrowRightLeft size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest mb-1">To</p>
                  <p className="font-bold">{s.to}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest mb-1">Panels</p>
                  <p className="font-mono font-bold text-lg">{s.panels}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-brand-primary/40 uppercase tracking-widest mb-1">Savings</p>
                  <p className="font-mono font-bold text-lg text-emerald-600">{s.savings}</p>
                </div>
                <button className="px-6 py-3 bg-brand-primary text-brand-secondary rounded-xl font-bold text-sm hover:bg-brand-accent transition-colors">
                  APPROVE TRANSFER
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Inventory = ({ panels }: { panels: Panel[] }) => {
  return (
    <div className="p-8 rounded-3xl bg-white border border-brand-primary/5">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-mono font-bold text-lg flex items-center gap-2">
          <Package size={20} /> RFID FLEET TRACKING
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium opacity-60">System Online</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-primary/10">
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Panel ID</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Current Site</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Type</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Reuse Cycles</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Status</th>
              <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40">Last Scanned</th>
            </tr>
          </thead>
          <tbody>
            {panels.map((panel) => (
              <tr key={panel.id} className="border-b border-brand-primary/5 hover:bg-brand-secondary/50 transition-colors group">
                <td className="py-4 font-mono font-bold text-sm">{panel.id}</td>
                <td className="py-4 text-sm font-medium">{panel.site_name}</td>
                <td className="py-4 text-sm opacity-60">{panel.type}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-brand-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent" style={{ width: `${(panel.reuse_cycles / 35) * 100}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold">{panel.reuse_cycles}/35</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    panel.status === 'in-use' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {panel.status}
                  </span>
                </td>
                <td className="py-4 text-xs opacity-40">{new Date(panel.last_tracked).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [suggestions, setSuggestions] = useState<MarketplaceSuggestion[]>([]);
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sitesRes, marketRes, invRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/sites'),
          fetch('/api/marketplace'),
          fetch('/api/inventory'),
        ]);
        
        setStats(await statsRes.json());
        setSites(await sitesRes.json());
        setSuggestions(await marketRes.json());
        setPanels(await invRes.json());
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-brand-secondary text-brand-primary font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary/40 mb-2">Larsen & Toubro Portfolio</p>
            <h2 className="text-4xl font-mono font-bold tracking-tighter">
              {activeTab === 'dashboard' && 'FLEET OVERVIEW'}
              {activeTab === 'optimizer' && 'AI OPTIMIZER'}
              {activeTab === 'marketplace' && 'MARKETPLACE'}
              {activeTab === 'inventory' && 'RFID TRACKING'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-brand-primary/40 uppercase">Current Session</p>
              <p className="text-xs font-mono font-bold">FEBRUARY 2026</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-brand-primary/40" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'optimizer' && <Optimizer />}
            {activeTab === 'marketplace' && <Marketplace suggestions={suggestions} />}
            {activeTab === 'inventory' && <Inventory panels={panels} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
