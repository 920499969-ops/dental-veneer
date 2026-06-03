import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { ChevronLeft, ChevronRight, GripHorizontal } from 'lucide-react';

const cases = [
  {
    id: 1,
    title: '四环素牙修复',
    desc: '6颗上牙瓷贴片修复，恢复自然洁白',
    before: '/case-1-before.jpg',
    after: '/case-1-after.jpg',
  },
  {
    id: 2,
    title: '牙缝过大',
    desc: '4颗瓷贴片关闭缝隙，重塑微笑曲线',
    before: '/case-2-before.jpg',
    after: '/case-2-after.jpg',
  },
  {
    id: 3,
    title: '牙齿缺损修复',
    desc: '瓷贴片完美修复切端缺损',
    before: '/case-3-before.jpg',
    after: '/case-3-after.jpg',
  },
];

export default function BeforeAfterGallery() {
  const [ref, isVisible] = useScrollReveal();
  const [activeCase, setActiveCase] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  const current = cases[activeCase];

  const handleMove = useCallback((e) => {
    if (!sliderRef.current || !dragging.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    setSliderPos(Math.max(5, Math.min(95, (x / rect.width) * 100)));
  }, []);

  const handleDown = () => { dragging.current = true; };
  const handleUp = () => { dragging.current = false; };

  const nextCase = () => setActiveCase((prev) => (prev + 1) % cases.length);
  const prevCase = () => setActiveCase((prev) => (prev - 1 + cases.length) % cases.length);

  return (
    <section id="before-after" ref={ref} className="w-full py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Gallery</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            真实案例<span className="text-gold italic">前后对比</span>
          </h2>
          <p className="text-brown-light max-w-2xl mx-auto">
            滑动中间的分割线，直观感受瓷贴片带来的惊艳变化
          </p>
        </motion.div>

        {/* Comparison Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Case info */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-semibold text-brown">{current.title}</h3>
            <div className="flex items-center gap-2">
              <button onClick={prevCase} className="p-2 rounded-full border border-brown/15 hover:border-gold hover:text-gold transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-brown-light min-w-[60px] text-center">
                {activeCase + 1} / {cases.length}
              </span>
              <button onClick={nextCase} className="p-2 rounded-full border border-brown/15 hover:border-gold hover:text-gold transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comparison slider */}
          <motion.div
            key={activeCase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              ref={sliderRef}
              className="relative w-full aspect-[4/5] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden cursor-col-resize select-none shadow-2xl bg-brown/5 touch-pan-y"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseDown={handleDown}
              onMouseUp={handleUp}
              onMouseLeave={handleUp}
              onTouchStart={handleDown}
              onTouchEnd={handleUp}
            >
              {/* Before image */}
              <img src={current.before} alt="修复前" className="absolute inset-0 w-full h-full object-cover" draggable="false" />

              {/* After image, clipped by slider */}
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src={current.after} alt="修复后" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
              </div>

              {/* Slider handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20"
                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gold">
                  <GripHorizontal className="w-4 h-4 text-gold" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-6 z-30 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">修复前</div>
              <div className="absolute bottom-4 right-6 z-30 bg-gold/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">修复后</div>
            </div>
          </motion.div>

          <p className="text-center text-brown-light mt-6 text-sm">{current.desc}</p>
        </motion.div>
      </div>
    </section>
  );
}
