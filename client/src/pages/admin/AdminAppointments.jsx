import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, X, Copy, Check } from 'lucide-react';
import { getBookings, updateBooking, deleteBooking } from '../../utils/api';

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

const serviceLabels = {
  consultation: '免费面诊',
  anterior: '前牙美学修复',
  smile_design: '微笑全线设计',
  full_mouth: '全口美学重建',
};

export default function AdminAppointments() {
  const [data, setData] = useState({ bookings: [], pagination: { page: 1, total: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', search: '', page: 1 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit: 15 };
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const result = await getBookings(params);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBooking(id, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除此预约吗？此操作不可撤销。')) return;
    try {
      await deleteBooking(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      // Temp visual feedback handled via state per-row if needed, simple alert for now
    } catch { /* fallback */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brown">预约管理</h1>
          <p className="text-brown-light text-sm mt-1">共 {data.pagination.total} 条预约记录</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-brown/5 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-light/40" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value, page: 1 })); }}
              placeholder="搜索客户姓名或手机号..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brown/10 bg-cream/30 focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none text-sm text-brown placeholder:text-brown-light/30"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '', page: 1 }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brown-light/40 hover:text-brown"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              { value: 'all', label: '全部' },
              { value: 'pending', label: '待确认' },
              { value: 'confirmed', label: '已确认' },
              { value: 'completed', label: '已完成' },
              { value: 'cancelled', label: '已取消' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilters((f) => ({ ...f, status: opt.value, page: 1 }))}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  filters.status === opt.value
                    ? 'bg-brown text-cream'
                    : 'bg-brown/5 text-brown-light hover:bg-brown/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-20">
          <svg className="animate-spin w-6 h-6 text-gold" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Empty state */}
      {!loading && data.bookings.length === 0 && (
        <div className="bg-white rounded-3xl border border-brown/5 shadow-sm py-20 text-center text-brown-light/50">
          暂无符合条件的预约记录
        </div>
      )}

      {/* Mobile Card View */}
      {!loading && data.bookings.length > 0 && (
        <div className="lg:hidden space-y-3">
          {data.bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-brown/5 shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-brown-light/50">#{b.id}</span>
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer outline-none border-0 ${statusColors[b.status]}`}
                >
                  {Object.entries(statusLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-brown text-base">{b.name}</span>
                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(b.phone); }}
                  className="text-sm text-brown-light hover:text-gold flex items-center gap-1" title="复制电话">
                  {b.phone} <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-3 text-sm text-brown-light">
                <span className="px-2 py-1 bg-brown/5 rounded-lg text-xs">{serviceLabels[b.service_type] || b.service_type}</span>
                <span>{b.preferred_date} {b.preferred_time}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-brown/5">
                <Link
                  to={`/admin/appointments/${b.id}`}
                  className="flex-1 py-2.5 text-center text-sm text-gold bg-gold/5 rounded-xl hover:bg-gold/10 transition-all font-medium"
                >
                  查看详情
                </Link>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="py-2.5 px-4 text-sm text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                >
                  删除
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && data.bookings.length > 0 && (
        <div className="hidden lg:block bg-white rounded-3xl border border-brown/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brown/5 bg-brown/[0.02]">
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">ID</th>
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">客户</th>
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">电话</th>
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">服务项目</th>
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">预约日期</th>
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">时间</th>
                  <th className="text-left py-4 px-5 text-brown-light font-medium text-xs">状态</th>
                  <th className="text-right py-4 px-5 text-brown-light font-medium text-xs">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.map((b, i) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-b border-brown/5 last:border-0 hover:bg-brown/[0.02] transition-colors"
                  >
                    <td className="py-4 px-5 text-brown-light/50 text-xs">#{b.id}</td>
                    <td className="py-4 px-5 font-medium text-brown">{b.name}</td>
                    <td className="py-4 px-5 text-brown-light">
                      <button onClick={() => navigator.clipboard.writeText(b.phone)}
                        className="hover:text-gold flex items-center gap-1" title="复制电话">
                        {b.phone} <Copy className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="py-4 px-5 text-brown-light text-xs">{serviceLabels[b.service_type] || b.service_type}</td>
                    <td className="py-4 px-5 text-brown-light">{b.preferred_date}</td>
                    <td className="py-4 px-5 text-brown-light">{b.preferred_time}</td>
                    <td className="py-4 px-5">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer outline-none border-0 ${statusColors[b.status]}`}
                      >
                        {Object.entries(statusLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/appointments/${b.id}`}
                          className="p-2 rounded-xl hover:bg-brown/5 text-brown-light hover:text-brown transition-all"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-brown-light hover:text-red-500 transition-all"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="bg-white rounded-3xl border border-brown/5 shadow-sm p-4 flex items-center justify-between">
            <span className="text-sm text-brown-light">
              第 {data.pagination.page} / {data.pagination.totalPages} 页
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
                disabled={data.pagination.page <= 1}
                className="p-2.5 rounded-xl hover:bg-brown/5 text-brown-light disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFilters((f) => ({ ...f, page: Math.min(data.pagination.totalPages, f.page + 1) }))}
                disabled={data.pagination.page >= data.pagination.totalPages}
                className="p-2.5 rounded-xl hover:bg-brown/5 text-brown-light disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
