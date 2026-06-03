import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Tag,
  Trash2,
  Sparkles,
  Copy,
} from 'lucide-react';
import { getBooking, updateBooking, deleteBooking } from '../../utils/api';

const statusLabels = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
};

const serviceLabels = {
  consultation: '免费面诊咨询',
  anterior: '前牙美学修复 (2-4颗)',
  smile_design: '微笑全线设计 (6-8颗)',
  full_mouth: '全口美学重建 (12-20颗)',
};

export default function AdminAppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(id)
      .then((data) => setBooking(data.booking))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const data = await updateBooking(id, { status: newStatus });
      setBooking(data.booking);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除此预约吗？')) return;
    try {
      await deleteBooking(id);
      navigate('/admin/appointments');
    } catch (err) {
      console.error(err);
    }
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

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="text-brown-light">预约不存在</p>
        <Link to="/admin/appointments" className="text-gold hover:underline text-sm mt-2 inline-block">
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/appointments"
          className="inline-flex items-center gap-2 text-brown-light hover:text-gold transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4" />
          删除预约
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-serif text-2xl font-bold text-brown mb-1">预约详情</h1>
        <p className="text-brown-light text-sm">预约编号: #{booking.id}</p>
      </motion.div>

      {/* Status actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-white rounded-3xl p-6 border border-brown/5 shadow-sm"
      >
        <h3 className="text-sm font-medium text-brown mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gold" /> 当前状态：{statusLabels[booking.status]}
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusLabels).map(([val, label]) => (
            <button
              key={val}
              onClick={() => handleStatusChange(val)}
              disabled={val === booking.status}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                val === booking.status
                  ? 'bg-brown text-cream cursor-default'
                  : 'bg-brown/5 text-brown-light hover:bg-brown/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Detail cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-3xl border border-brown/5 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-brown/5">
          <h3 className="font-serif text-lg font-semibold text-brown flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" /> 客户信息
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gold" />
            <span className="text-brown-light w-20 text-sm">姓名</span>
            <span className="font-medium text-brown">{booking.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gold" />
            <span className="text-brown-light w-20 text-sm">手机</span>
            <span className="font-medium text-brown">{booking.phone}</span>
            <button onClick={() => navigator.clipboard.writeText(booking.phone)}
              className="ml-auto p-1.5 rounded-lg hover:bg-gold/10 text-brown-light hover:text-gold transition-all" title="复制电话">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {booking.email && (
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gold" />
              <span className="text-brown-light w-20 text-sm">微信号</span>
              <span className="font-medium text-brown">{booking.email}</span>
              <button onClick={() => navigator.clipboard.writeText(booking.email)}
                className="ml-auto p-1.5 rounded-lg hover:bg-gold/10 text-brown-light hover:text-gold transition-all" title="复制微信号">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white rounded-3xl border border-brown/5 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-brown/5">
          <h3 className="font-serif text-lg font-semibold text-brown flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold" /> 预约信息
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-gold" />
            <span className="text-brown-light w-20 text-sm">服务</span>
            <span className="font-medium text-brown">{serviceLabels[booking.service_type] || booking.service_type}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gold" />
            <span className="text-brown-light w-20 text-sm">日期</span>
            <span className="font-medium text-brown">{booking.preferred_date}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gold" />
            <span className="text-brown-light w-20 text-sm">时间</span>
            <span className="font-medium text-brown">{booking.preferred_time}</span>
          </div>
          {booking.message && (
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gold mt-0.5" />
              <span className="text-brown-light w-20 text-sm flex-shrink-0">备注</span>
              <span className="text-brown">{booking.message}</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-xs text-brown-light/50 space-y-1"
      >
        <p>创建时间：{booking.created_at}</p>
        <p>最后更新：{booking.updated_at}</p>
      </motion.div>
    </div>
  );
}
