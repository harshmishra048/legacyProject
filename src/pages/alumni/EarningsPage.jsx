import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownLeft, 
  Download, Wallet, CreditCard, ShieldCheck, CheckCircle2, Clock, Filter 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { Badge, Button, StatCard, SectionHeader } from '../../components/ui';
import { EARNINGS_DATA } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function EarningsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('9200');
  const [bankUpi, setBankUpi] = useState('priya.kapoor@okhdfcbank');

  const filteredTxns = EARNINGS_DATA.transactions.filter(t => {
    if (selectedFilter === 'completed') return t.status === 'completed';
    if (selectedFilter === 'pending') return t.status === 'pending';
    return true;
  });

  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      toast.success(`Withdrawal of ₹${Number(withdrawAmount).toLocaleString('en-IN')} initiated to ${bankUpi}!`);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contribution Earnings & Payouts</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Track revenue from your masterclasses, workshops, and 1-on-1 mentorship sessions.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="secondary" size="md" onClick={() => toast.success('Exporting GST compliant statement...')}>
              <Download size={14} /> Download Tax Statement
            </Button>
            <Button variant="primary" size="md" onClick={() => setShowWithdrawModal(true)}>
              <Wallet size={14} /> Withdraw Funds
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${EARNINGS_DATA.total.toLocaleString('en-IN')}`, icon: <DollarSign size={20} />, color: 'primary', trend: 18 },
          { label: 'This Month', value: `₹${EARNINGS_DATA.thisMonth.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: 'success', trend: 12 },
          { label: 'Pending Settlement', value: `₹${EARNINGS_DATA.pending.toLocaleString('en-IN')}`, icon: <Clock size={20} />, color: 'warning', sub: 'Settles in 48h' },
          { label: 'Withdrawable Balance', value: `₹${EARNINGS_DATA.withdrawable.toLocaleString('en-IN')}`, icon: <Wallet size={20} />, color: 'violet', sub: 'Ready to payout' },
        ].map((kpi, idx) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
            <StatCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Revenue Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Curve */}
        <motion.div 
          className="card p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SectionHeader
            title="Monthly Revenue Growth"
            subtitle="Gross earnings generated from student and university registrations"
            className="mb-4"
          />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={EARNINGS_DATA.monthly}>
              <defs>
                <linearGradient id="earnColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                contentStyle={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: 'var(--text-primary)'
                }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#6366f1" strokeWidth={2.5} fill="url(#earnColor)" dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Sessions Count by Month */}
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <SectionHeader
            title="Sessions Hosted"
            subtitle="Contribution cadence"
            className="mb-4"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={EARNINGS_DATA.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [v, 'Sessions Hosted']}
                contentStyle={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="sessions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Transactions & Settlements Table */}
      <motion.div 
        className="card p-6 space-y-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-primary">Transaction History</h3>
            <p className="text-xs text-muted">Transparent ledger of all session purchases & payouts.</p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'completed', label: 'Completed' },
              { id: 'pending', label: 'Pending' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  selectedFilter === f.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-surface border-default text-secondary hover:border-strong'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Contribution Session</th>
                <th>Participant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-muted">{t.id}</td>
                  <td className="font-semibold text-primary">{t.session}</td>
                  <td className="text-secondary">{t.participant}</td>
                  <td className="font-bold text-primary">₹{t.amount}</td>
                  <td>
                    <span className={`badge ${
                      t.status === 'completed' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    } text-[10px] font-bold uppercase`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="text-xs text-muted">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="modal-overlay">
            <motion.div
              className="modal-content max-w-md p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-start justify-between pb-4 border-b border-default mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Payout Request</h3>
                    <p className="text-xs text-muted">Transfer funds to bank or UPI</p>
                  </div>
                </div>
                <button onClick={() => setShowWithdrawModal(false)} className="text-muted hover:text-primary text-sm p-1">
                  ✕
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="p-3.5 bg-surface-secondary rounded-xl flex justify-between items-center text-xs">
                  <span className="text-muted">Available to Withdraw</span>
                  <span className="font-extrabold text-sm text-primary">₹{EARNINGS_DATA.withdrawable.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1.5">Withdrawal Amount (₹)</label>
                  <input
                    type="number"
                    className="input text-sm font-bold"
                    max={EARNINGS_DATA.withdrawable}
                    min={500}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted block mb-1.5">Bank UPI ID / VPA</label>
                  <input
                    type="text"
                    className="input text-sm"
                    value={bankUpi}
                    onChange={(e) => setBankUpi(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-muted mt-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" /> Direct bank transfer processed via Cashfree/RazorpayX.
                  </p>
                </div>

                <div className="pt-3 border-t border-default flex justify-end gap-2.5">
                  <Button type="button" variant="secondary" size="md" onClick={() => setShowWithdrawModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" loading={isWithdrawing}>
                    Confirm ₹{Number(withdrawAmount).toLocaleString('en-IN')} Payout
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
