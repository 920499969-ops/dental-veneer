import { useRef } from 'react';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { Heart, Eye, Timer, Feather, Droplets, ThumbsUp } from 'lucide-react';

const benefits = [
  { icon: Heart, title: '微创不磨牙', desc: '仅需0.3mm微量预备，最大限度保留原生牙齿结构，远离敏感疼痛。' },
  { icon: Eye, title: '透光自然', desc: '全瓷材料透光率与天然牙釉质匹配，在阳光下呈现自然通透感。' },
  { icon: Timer, title: '快速焕新', desc: '2-3次就诊即可完成，单次操作约1-2小时，即做即走。' },
  { icon: Feather, title: '轻薄舒适', desc: '贴片厚度仅0.2mm，如隐形眼镜般轻薄，无异物感，快速适应。' },
  { icon: Droplets, title: '不易着色', desc: '高密度瓷面经过专业抛光，不易吸附咖啡、茶渍等色素。' },
  { icon: ThumbsUp, title: '持久耐用', desc: '配合德国专业粘接系统，正常使用可保持10-15年。' },
];

export default function BenefitsGrid() {
  const [ref, isVisible] = useScrollReveal();
  const containerRef = useRef(null);

  return (
    <section className="w-full py-24 md:py-32 px-6 bg-gradient-to-b from-warm-pink/50 to-cream relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-rose/10 rounded-full blur-3xl" />

      <div ref={ref} className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Why Choose Us</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            为什么选择<span className="text-gold italic">瓷贴片</span>？
          </h2>
          <p className="text-brown-light max-w-2xl mx-auto">
            六大核心优势，让瓷贴片成为美容牙科的黄金选择
          </p>
        </motion.div>

        {/* 3D Tilt Cards Grid */}
        <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <TiltCard key={benefit.title} index={i} isVisible={isVisible}>
                <div className="p-8 text-center h-full flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-cream border border-brown/8 flex items-center justify-center mb-5 group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                    <Icon className="w-7 h-7 text-gold group-hover:text-cream transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-brown mb-3">{benefit.title}</h3>
                  <p className="text-sm text-brown-light leading-relaxed">{benefit.desc}</p>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children, index, isVisible }) {
  const cardRef = useRef(null);

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-brown/5 shadow-sm hover:shadow-xl hover:shadow-brown/5 transition-shadow duration-300 cursor-default"
        style={{
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
