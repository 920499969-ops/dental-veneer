import { useState } from 'react';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import MapModal from './MapModal';

const LAT = 20.028;
const LNG = 110.355;

export default function MapSection() {
  const [ref, isVisible] = useScrollReveal();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section ref={ref} className="w-full py-24 md:py-32 px-6 bg-warm-pink/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Location</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
              找到<span className="text-gold italic">我们</span>
            </h2>
            <p className="text-brown-light max-w-2xl mx-auto">
              点击地图开始导航，或直接拨打电话联系我们
            </p>
          </motion.div>

          {/* Map + Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Map area - clickable styled map */}
            <button
              onClick={() => setShowModal(true)}
              className="md:col-span-2 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-brown/10 border-2 border-brown/5 hover:border-gold/30 transition-all group cursor-pointer bg-sage-light/20"
            >
              {/* Stylized map background */}
              <div className="absolute inset-0 bg-[#E8ECD8]">
                {/* Grid lines (streets) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                  {/* Horizontal streets */}
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#D4D9C5" strokeWidth="4" />
                  <line x1="0" y1="140" x2="400" y2="145" stroke="#D4D9C5" strokeWidth="3" />
                  <line x1="0" y1="210" x2="400" y2="205" stroke="#D4D9C5" strokeWidth="5" />
                  <line x1="0" y1="260" x2="400" y2="262" stroke="#D4D9C5" strokeWidth="2" />
                  {/* Vertical streets */}
                  <line x1="80" y1="0" x2="80" y2="300" stroke="#D4D9C5" strokeWidth="3" />
                  <line x1="180" y1="0" x2="185" y2="300" stroke="#D4D9C5" strokeWidth="5" />
                  <line x1="280" y1="0" x2="278" y2="300" stroke="#D4D9C5" strokeWidth="4" />
                  <line x1="350" y1="0" x2="350" y2="300" stroke="#D4D9C5" strokeWidth="2" />
                  {/* Main road (highlighted) */}
                  <line x1="0" y1="145" x2="400" y2="150" stroke="#F5EDE4" strokeWidth="8" />
                  <line x1="183" y1="0" x2="188" y2="300" stroke="#F5EDE4" strokeWidth="10" />
                  {/* Park area */}
                  <rect x="300" y="10" width="80" height="70" rx="8" fill="#C5DBC0" opacity="0.6" />
                  <rect x="10" y="220" width="60" height="70" rx="8" fill="#C5DBC0" opacity="0.5" />
                  {/* Water */}
                  <rect x="320" y="220" width="70" height="80" rx="4" fill="#C4D8E0" opacity="0.4" />
                </svg>

                {/* Location label */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm">
                  <span className="text-xs font-medium text-brown/50">美兰区 · 瓦灶路</span>
                </div>

                {/* Center marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gold shadow-xl shadow-gold/30 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gold/30 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="mt-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                    <span className="text-[11px] font-semibold text-brown">臻白瓷贴片</span>
                  </div>
                </div>

                {/* Building indicator */}
                <div className="absolute top-[47%] left-[43%] w-14 h-10 bg-gold/20 rounded-lg border border-gold/30" />
              </div>

              {/* Click overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg flex items-center gap-2.5">
                  <Navigation className="w-4 h-4 text-gold" />
                  <span className="font-medium text-brown text-sm">点击开始导航</span>
                </div>
              </div>
            </button>

            {/* Info card */}
            <div className="bg-white rounded-3xl p-8 border border-brown/5 shadow-sm flex flex-col justify-center space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  <span className="text-xs text-gold font-medium tracking-wider">地址</span>
                </div>
                <p className="text-brown text-sm leading-relaxed">
                  海南省海口市美兰区瓦灶路3号<br />
                  碧桂园·美舍仕家2栋201
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Phone className="w-5 h-5 text-gold" />
                  <span className="text-xs text-gold font-medium tracking-wider">电话</span>
                </div>
                <a href="tel:13976387730" className="text-brown text-lg font-semibold hover:text-gold transition-colors">
                  13976387730
                </a>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Clock className="w-5 h-5 text-gold" />
                  <span className="text-xs text-gold font-medium tracking-wider">营业时间</span>
                </div>
                <p className="text-brown-light text-sm leading-relaxed">
                  周一至周五 9:00 - 18:00<br />
                  周六至周日 9:00 - 17:00
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 bg-gold text-brown rounded-2xl text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                开始导航
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <MapModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
