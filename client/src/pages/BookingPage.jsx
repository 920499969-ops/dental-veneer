import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, User, Phone, Calendar, Clock, MessageSquare, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import { submitBooking } from '../utils/api';

const STEPS = ['选择方案', '填写信息', '选择时间', '确认提交'];

const serviceTypes = [
  { value: 'consultation', label: '免费面诊咨询', icon: Sparkles, desc: '首次咨询，了解您的需求并制定方案' },
  { value: 'anterior', label: '前牙美学修复 (2-4颗)', icon: Sparkles, desc: '针对前牙颜色、形态问题' },
  { value: 'smile_design', label: '微笑全线设计 (6-8颗)', icon: Sparkles, desc: '全方位微笑美学设计' },
  { value: 'full_mouth', label: '全口美学重建 (12-20颗)', icon: Sparkles, desc: '全面的口腔美学修复' },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    service_type: '',
    name: '',
    phone: '',
    wechat: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
    agreed: false,
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!form.service_type;
      case 1: return !!form.name && !!form.phone && form.phone.length >= 11;
      case 2: return !!form.preferred_date && !!form.preferred_time;
      case 3: return form.agreed;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canNext()) return;
    setLoading(true);
    setError('');
    try {
      await submitBooking({
        name: form.name,
        phone: form.phone,
        wechat: form.wechat,
        service_type: form.service_type,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        message: form.message,
      });
      navigate('/booking/success');
    } catch (err) {
      setError(err.message || '预约提交失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // Generate date options: tomorrow to 3 months, excluding Sundays
  const dateOptions = [];
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  for (let i = 1; i <= 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    if (d > threeMonthsLater) break;
    if (d.getDay() !== 0) {
      dateOptions.push({
        value: d.toISOString().split('T')[0],
        label: `${d.getMonth() + 1}月${d.getDate()}日`,
        weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()],
      });
    }
  }

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-brown-light hover:text-gold transition-colors mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown mb-2">预约面诊</h1>
            <p className="text-brown-light mb-10">填写以下信息，我们会在24小时内与您确认</p>
          </motion.div>

          {/* Progress steps */}
          <div className="flex items-center justify-between mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      i < step
                        ? 'bg-gold text-white'
                        : i === step
                        ? 'bg-brown text-cream ring-4 ring-brown/10'
                        : 'bg-brown/5 text-brown-light'
                    }`}
                  >
                    {i < step ? <Check className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 hidden sm:block ${i <= step ? 'text-brown' : 'text-brown-light/50'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mt-[-16px] transition-colors duration-300 ${i < step ? 'bg-gold' : 'bg-brown/8'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-lg shadow-brown/3 border border-brown/5"
            >
              {/* Step 0: Service type */}
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="font-serif text-xl font-semibold text-brown mb-6">选择您感兴趣的服务</h2>
                  {serviceTypes.map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <button
                        key={svc.value}
                        onClick={() => updateForm('service_type', svc.value)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
                          form.service_type === svc.value
                            ? 'border-gold bg-gold/5 shadow-md shadow-gold/5'
                            : 'border-brown/8 hover:border-brown/20 hover:bg-brown/[0.02]'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          form.service_type === svc.value ? 'bg-gold text-white' : 'bg-brown/5 text-brown-light'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-brown">{svc.label}</div>
                          <div className="text-sm text-brown-light mt-0.5">{svc.desc}</div>
                        </div>
                        {form.service_type === svc.value && (
                          <Check className="w-5 h-5 text-gold flex-shrink-0 mt-3 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 1: Personal info */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-serif text-xl font-semibold text-brown mb-6">您的联系方式</h2>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2">
                      <User className="w-4 h-4 text-gold" /> 姓名 *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="请输入您的姓名"
                      className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none transition-all text-brown placeholder:text-brown-light/40"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2">
                      <Phone className="w-4 h-4 text-gold" /> 手机号 *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="请输入您的手机号"
                      className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none transition-all text-brown placeholder:text-brown-light/40"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2">
                      <MessageSquare className="w-4 h-4 text-gold" /> 微信号（选填）
                    </label>
                    <input
                      type="text"
                      value={form.wechat}
                      onChange={(e) => updateForm('wechat', e.target.value)}
                      placeholder="方便工作人员联系您"
                      className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none transition-all text-brown placeholder:text-brown-light/40"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-brown mb-6 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gold" /> 选择面诊日期
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {dateOptions.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => updateForm('preferred_date', d.value)}
                          className={`p-3 rounded-2xl text-center border-2 transition-all duration-300 ${
                            form.preferred_date === d.value
                              ? 'border-gold bg-gold/5 shadow-sm shadow-gold/5'
                              : 'border-brown/8 hover:border-brown/20'
                          }`}
                        >
                          <div className="text-xs text-brown-light">{d.weekday}</div>
                          <div className={`font-medium mt-0.5 ${form.preferred_date === d.value ? 'text-gold' : 'text-brown'}`}>
                            {d.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.preferred_date && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <h2 className="font-serif text-xl font-semibold text-brown mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gold" /> 选择时间
                      </h2>
                      <input
                        type="time"
                        value={form.preferred_time}
                        onChange={(e) => updateForm('preferred_time', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none text-brown text-lg text-center cursor-pointer"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl font-semibold text-brown mb-6">确认预约信息</h2>

                  <div className="bg-cream/50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-brown/5">
                      <span className="text-brown-light">服务项目</span>
                      <span className="font-medium text-brown">
                        {serviceTypes.find((s) => s.value === form.service_type)?.label || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-brown/5">
                      <span className="text-brown-light">姓名</span>
                      <span className="font-medium text-brown">{form.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-brown/5">
                      <span className="text-brown-light">手机号</span>
                      <span className="font-medium text-brown">{form.phone}</span>
                    </div>
                    {form.wechat && (
                      <div className="flex justify-between items-center py-2 border-b border-brown/5">
                        <span className="text-brown-light">微信号</span>
                        <span className="font-medium text-brown">{form.wechat}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-brown/5">
                      <span className="text-brown-light">预约日期</span>
                      <span className="font-medium text-brown">{form.preferred_date}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-brown-light">预约时间</span>
                      <span className="font-medium text-brown">{form.preferred_time}</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2">
                      <MessageSquare className="w-4 h-4 text-gold" /> 备注（选填）
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => updateForm('message', e.target.value)}
                      placeholder="如有特殊需求或疑问，请在此留言"
                      rows={3}
                      className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none transition-all text-brown placeholder:text-brown-light/40 resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.agreed}
                      onChange={(e) => updateForm('agreed', e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded-lg border-brown/20 text-gold focus:ring-gold/20 accent-gold"
                    />
                    <span className="text-sm text-brown-light group-hover:text-brown transition-colors">
                      我已阅读并同意<a href="#" className="text-gold hover:underline">《隐私政策》</a>和<a href="#" className="text-gold hover:underline">《服务条款》</a>，同意工作人员通过电话与我联系确认预约
                    </span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6 sm:mt-8 gap-3">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className={`px-4 sm:px-6 py-3 rounded-full text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all ${
                step === 0
                  ? 'text-brown-light/30 cursor-not-allowed'
                  : 'text-brown-light hover:text-brown border border-brown/15 hover:border-brown/30 active:bg-brown/5'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">上一步</span>
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className={`px-5 sm:px-8 py-3 rounded-full text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all ${
                  canNext()
                    ? 'bg-brown text-cream hover:bg-brown-light hover:shadow-lg hover:shadow-brown/20 active:scale-95'
                    : 'bg-brown/10 text-brown-light/40 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">下一步</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || loading}
                className={`px-5 sm:px-8 py-3 rounded-full text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all ${
                  canNext() && !loading
                    ? 'bg-gold text-brown hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-95'
                    : 'bg-brown/10 text-brown-light/40 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    提交中...
                  </>
                ) : (
                  <>
                    确认提交
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
