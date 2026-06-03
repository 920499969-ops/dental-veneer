import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [greetingName, setGreetingName] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'greeting'
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  const handleLogin = async () => {
    if (!phone) { setError('请输入手机号'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('admin_token', data.token);
      setGreetingName(data.admin.display_name);
      setIsManager(data.admin.role === 'manager');
      setStep('greeting');
      setTimeout(() => navigate('/admin/dashboard'), 2500);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!phone || password.length < 6) { setError('请填写手机号，密码至少6位'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/admin/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, password, name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.pending) { setError('注册申请已提交，请等待店长审批'); return; }
      localStorage.setItem('admin_token', data.token);
      setGreetingName(data.admin.display_name);
      setIsManager(data.admin.role === 'manager');
      setStep('greeting');
      setTimeout(() => navigate('/admin/dashboard'), 2500);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full min-h-screen bg-cream flex items-center justify-center px-4">
      <AnimatePresence>
        {step === 'greeting' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-cream flex items-center justify-center">
            <div className="text-center">
              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4">
                <div className={'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl ' + (isManager ? 'bg-gradient-to-br from-gold to-gold-dark shadow-gold/20' : 'bg-gradient-to-br from-sage to-sage-light shadow-sage/20')}>
                  {isManager ? <Sparkles className="w-10 h-10 text-white" /> : <User className="w-10 h-10 text-white" />}
                </div>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} className="font-serif text-3xl sm:text-4xl font-bold text-brown mb-2">
                {isManager ? <><span className="text-gold">吴店长</span>好！</> : <>{greetingName}好！</>}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-brown-light text-sm">欢迎使用臻白工作室员工系统</motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8">
                <div className="w-8 h-8 mx-auto rounded-full border-2 border-gold border-t-transparent animate-spin" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {step !== 'greeting' && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20"><Sparkles className="w-6 h-6 text-white" /></div>
            </Link>
            <h1 className="font-serif text-2xl font-bold text-brown">员工系统</h1>
            <p className="text-brown-light text-sm mt-1">臻白瓷贴片工作室</p>
          </div>

          <div className="flex bg-brown/5 rounded-2xl p-1 mb-6">
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} className={'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ' + (mode === m ? 'bg-white text-brown shadow-sm' : 'text-brown-light hover:text-brown')}>
                {m === 'login' ? '登录' : '注册'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-brown/5 border border-brown/5 space-y-4">
            {error && <div className={'p-4 rounded-2xl text-sm ' + (error.includes('已提交') || error.includes('审批') ? 'bg-amber-50 border border-amber-100 text-amber-700' : 'bg-red-50 border border-red-100 text-red-600')}>{error}</div>}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2"><Phone className="w-4 h-4 text-gold" /> 手机号</label>
              <input ref={inputRef} type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 11)); setError(''); }}
                placeholder="请输入手机号" maxLength={11}
                className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none text-brown placeholder:text-brown-light/40 text-lg tracking-wider" />
            </div>

            {mode === 'login' ? (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2"><Lock className="w-4 h-4 text-gold" /> 密码（店长无需填写）</label>
                  <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="员工请输入密码" className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none text-brown placeholder:text-brown-light/40" />
                </div>
                <button onClick={handleLogin} disabled={loading || !phone} className="w-full py-3.5 bg-brown text-cream rounded-2xl text-sm font-medium hover:bg-brown-light transition-all disabled:opacity-50">
                  {loading ? '登录中...' : '登录'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2"><Lock className="w-4 h-4 text-gold" /> 设置密码（至少6位）</label>
                  <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="设置登录密码" className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none text-brown placeholder:text-brown-light/40" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-brown mb-2"><User className="w-4 h-4 text-gold" /> 姓名（选填）</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="方便店长识别" className="w-full px-4 py-3.5 rounded-2xl border border-brown/15 bg-cream/50 focus:border-gold focus:ring-4 focus:ring-gold/10 outline-none text-brown placeholder:text-brown-light/40" />
                </div>
                <button onClick={handleRegister} disabled={loading || !phone || password.length < 6} className="w-full py-3.5 bg-gold text-brown rounded-2xl text-sm font-semibold hover:bg-gold-light transition-all disabled:opacity-50">
                  {loading ? '提交中...' : '注册'}
                </button>
              </>
            )}
          </div>

          <p className="text-center mt-6"><Link to="/" className="text-sm text-brown-light hover:text-gold transition-colors">← 返回前台</Link></p>
        </motion.div>
      )}
    </div>
  );
}
