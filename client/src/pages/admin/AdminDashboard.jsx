import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  UserX,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { getStats, getAdminMe } from '../../utils/api';

const statusLabels = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [pendingList, setPendingList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editName, setEditName] = useState('');

  const token = () => localStorage.getItem('admin_token');
  const authHeaders = () => ({ Authorization: 'Bearer ' + token() });

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/admin/pending', { headers: authHeaders() });
      if (res.ok) setPendingList((await res.json()).pending || []);
    } catch (e) {}
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff', { headers: authHeaders() });
      if (res.ok) setStaffList((await res.json()).staff || []);
    } catch (e) {}
  };

  useEffect(() => {
    Promise.all([getStats(), getAdminMe()])
      .then(([statsData, meData]) => {
        setStats(statsData);
        setCurrentAdmin(meData.admin);
        if (meData.admin?.role === 'manager') {
          fetchPending();
          fetchStaff();
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    await fetch('/api/admin/approve/' + id, { method: 'POST', headers: authHeaders() });
    fetchPending();
    fetchStaff();
  };

  const handleReject = async (id) => {
    await fetch('/api/admin/reject/' + id, { method: 'POST', headers: authHeaders() });
    fetchPending();
  };

  const handleSaveName = async (id) => {
    if (!editName.trim()) return;
    await fetch('/api/admin/staff/' + id, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: editName.trim() }),
    });
    setEditingStaff(null);
    setEditName('');
    fetchStaff();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-6 h-6 text-gold" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const statCards = [
    { label: '总预约数', value: stats?.total || 0, icon: CalendarCheck, color: 'from-amber-50 to-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
    { label: '待确认', value: stats?.pending || 0, icon: Clock, color: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: '已完成', value: stats?.completed || 0, icon: CheckCircle2, color: 'from-green-50 to-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: '今日预约', value: stats?.today || 0, icon: TrendingUp, color: 'from-purple-50 to-purple-100', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brown">仪表盘</h1>
        <p className="text-brown-light text-sm mt-1">欢迎回来，查看今日预约概况</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-2xl sm:rounded-3xl bg-gradient-to-br ${card.color} p-4 sm:p-6 border border-brown/5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-brown-light mb-1">{card.label}</p>
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-brown">{card.value}</p>
                </div>
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pending staff approvals (manager only) */}
      {currentAdmin?.role === 'manager' && pendingList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-brown flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              待审批员工 ({pendingList.length})
            </h2>
          </div>
          <div className="divide-y divide-brown/5">
            {pendingList.map((p) => (
              <div key={p.id} className="p-4 sm:p-6 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-brown">{p.display_name}</div>
                  <div className="text-sm text-brown-light">{p.phone}</div>
                  <div className="text-xs text-brown-light/40 mt-0.5">申请时间: {p.created_at?.slice(0, 16)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:bg-green-100 transition-all flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> 批准
                  </button>
                  <button
                    onClick={() => handleReject(p.id)}
                    className="px-4 py-2 bg-red-50 text-red-500 rounded-full text-xs font-medium hover:bg-red-100 transition-all flex items-center gap-1.5"
                  >
                    <UserX className="w-3.5 h-3.5" /> 拒绝
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Staff management (manager only) */}
      {currentAdmin?.role === 'manager' && staffList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-brown/5 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-brown/5">
            <h2 className="font-serif text-lg font-semibold text-brown flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              员工管理 ({staffList.length}人)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brown/5 bg-brown/[0.01]">
                  <th className="text-left py-3 px-6 text-brown-light font-medium text-xs">姓名</th>
                  <th className="text-left py-3 px-6 text-brown-light font-medium text-xs">手机号</th>
                  <th className="text-left py-3 px-6 text-brown-light font-medium text-xs">角色</th>
                  <th className="text-left py-3 px-6 text-brown-light font-medium text-xs">状态</th>
                  <th className="text-right py-3 px-6 text-brown-light font-medium text-xs">操作</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id} className="border-b border-brown/5 last:border-0 hover:bg-brown/[0.01]">
                    <td className="py-3 px-6">
                      {editingStaff === s.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName(s.id)}
                            className="w-24 px-2 py-1 rounded-lg border border-gold bg-cream text-sm text-brown outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleSaveName(s.id)} className="text-xs text-gold font-medium hover:underline">保存</button>
                          <button onClick={() => setEditingStaff(null)} className="text-xs text-brown-light/40 hover:underline">取消</button>
                        </div>
                      ) : (
                        <span className="font-medium text-brown">{s.display_name}</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-brown-light font-mono text-xs">{s.phone}</td>
                    <td className="py-3 px-6">
                      <span className={'px-2 py-0.5 rounded-full text-[10px] font-medium ' +
                        (s.role === 'manager' ? 'bg-gold/10 text-gold-dark' : 'bg-brown/5 text-brown-light')}>
                        {s.role === 'manager' ? '店长' : '员工'}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={'px-2 py-0.5 rounded-full text-[10px] font-medium ' +
                        (s.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                        {s.status === 'approved' ? '已激活' : '待审批'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {editingStaff !== s.id && (
                          <button
                            onClick={() => { setEditingStaff(s.id); setEditName(s.display_name); }}
                            className="text-xs text-gold hover:underline"
                          >
                            编辑姓名
                          </button>
                        )}
                        {s.status === 'approved' && (
                          <button
                            onClick={() => {
                              const pw = window.prompt('请输入新密码（至少6位）：');
                              if (pw && pw.length >= 6) {
                                fetch('/api/admin/reset-password/' + s.id, {
                                  method: 'POST',
                                  headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ password: pw }),
                                }).then(r => r.json()).then(d => {
                                  if (d.success) alert('密码已重置');
                                  else alert(d.error || '操作失败');
                                });
                              } else if (pw) { alert('密码至少6位'); }
                            }}
                            className="text-xs text-brown-light/50 hover:text-amber-600 underline"
                          >
                            重置密码
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Recent bookings */}
      <div className="bg-white rounded-3xl border border-brown/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brown/5 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-brown flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            最近预约
          </h2>
          <Link
            to="/admin/appointments"
            className="text-sm text-gold hover:underline flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brown/5">
                <th className="text-left py-3 px-6 text-brown-light font-medium">客户</th>
                <th className="text-left py-3 px-6 text-brown-light font-medium">电话</th>
                <th className="text-left py-3 px-6 text-brown-light font-medium">预约日期</th>
                <th className="text-left py-3 px-6 text-brown-light font-medium">时间</th>
                <th className="text-left py-3 px-6 text-brown-light font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.map((b) => (
                <tr key={b.id} className="border-b border-brown/5 last:border-0 hover:bg-brown/[0.02] transition-colors">
                  <td className="py-3.5 px-6 font-medium text-brown">{b.name}</td>
                  <td className="py-3.5 px-6 text-brown-light">{b.phone}</td>
                  <td className="py-3.5 px-6 text-brown-light">{b.preferred_date}</td>
                  <td className="py-3.5 px-6 text-brown-light">{b.preferred_time}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                      {statusLabels[b.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brown-light/50">暂无预约记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
