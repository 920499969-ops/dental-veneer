import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

export default function BookingSuccess() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen pt-32 pb-20 bg-cream flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center px-4 sm:px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brown mb-4">
              预约成功！<span className="text-gold italic">感谢您的信任</span>
            </h1>
            <p className="text-brown-light leading-relaxed mb-8">
              我们已收到您的预约信息，工作人员将在
              <span className="text-gold font-medium">24小时内</span>
              通过电话与您确认面诊时间。请保持手机畅通。
            </p>

            <div className="bg-white/80 rounded-3xl p-8 shadow-sm border border-brown/5 mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-brown-light mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                温馨提示
              </div>
              <ul className="text-sm text-brown-light space-y-2 text-left">
                <li>• 面诊全程免费，无需任何费用</li>
                <li>• 面诊时长约30分钟，请预留充足时间</li>
                <li>• 如时间有变动，请提前电话告知我们</li>
                <li>• 面诊地址：深圳市南山区科技园路XX号</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="px-8 py-3.5 bg-brown text-cream rounded-full text-sm font-medium hover:bg-brown-light transition-all duration-300 flex items-center gap-2 group"
              >
                <Home className="w-4 h-4" />
                返回首页
              </Link>
              <a
                href="#what-are-veneers"
                className="px-8 py-3.5 text-brown-light hover:text-brown rounded-full text-sm font-medium border border-brown/15 hover:border-brown/30 transition-all duration-300 flex items-center gap-2 group"
              >
                了解更多瓷贴片知识
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
