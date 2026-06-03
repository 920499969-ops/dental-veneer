import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { ArrowRight, Sparkles, Phone, MapPin } from 'lucide-react';

export default function CTABanner() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="w-full py-16 sm:py-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto relative"
      >
        <div className="relative bg-brown rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 lg:p-20 text-center overflow-hidden shadow-2xl shadow-brown/20">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full border border-cream/10" />
          <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full border border-cream/10" />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 rounded-full bg-gold/30" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream/10 border border-cream/10 text-cream/80 text-sm mb-8">
                <Sparkles className="w-4 h-4 text-gold" />
                免费面诊 · 零消费压力
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-cream mb-4 sm:mb-6 leading-tight"
            >
              准备好迎接<br className="md:hidden" />
              您的<span className="text-gold italic">全新笑容</span>了吗？
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-cream/60 max-w-xl mx-auto mb-10"
            >
              只需一次面诊，即可了解您的专属瓷贴片方案。无压力咨询，专业的建议，让您做出明智的决定。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link
                to="/booking"
                className="group px-8 py-4 bg-gold text-brown rounded-full text-base font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:shadow-gold/20 active:scale-95 flex items-center gap-2"
              >
                立即预约免费面诊
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:13976387730"
                className="px-8 py-4 text-cream/80 hover:text-cream rounded-full text-base font-medium border border-cream/20 hover:border-cream/40 transition-all duration-300 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                电话咨询
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center gap-2 text-cream/40 text-sm"
            >
              <MapPin className="w-4 h-4" />
              海南省海口市美兰区瓦灶路3号 碧桂园·美舍仕家2栋201
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
