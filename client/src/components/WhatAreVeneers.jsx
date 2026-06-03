import { useState } from 'react';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { Shield, Sparkles, Smile, Zap, ChevronRight } from 'lucide-react';

const cards = [
  {
    icon: Sparkles,
    title: '什么是瓷贴片？',
    content:
      '瓷贴片是一种薄如隐形眼镜（约0.2-0.5mm）的全瓷修复体，粘贴在牙齿表面，用于改善牙齿的颜色、形状、大小和对齐度。它就像给牙齿穿上了一件定制的"高级礼服"。',
    color: 'from-amber-100 to-amber-50',
    iconBg: 'bg-amber-100',
  },
  {
    icon: Shield,
    title: '安全无创',
    content:
      '相比传统烤瓷牙需要大量磨牙，瓷贴片仅需微量预备甚至不磨牙，最大程度保留您自己的健康牙体组织。材料生物相容性极佳，不会引起牙龈过敏或变色。',
    color: 'from-rose-100 to-rose-50',
    iconBg: 'bg-rose-100',
  },
  {
    icon: Zap,
    title: '快速见效',
    content:
      '从初次面诊到戴上贴片，通常只需2-3次就诊。单次操作约1-2小时，即刻拥有明星般闪耀笑容。无需漫长的矫正过程，是快节奏生活的最佳选择。',
    color: 'from-green-100 to-green-50',
    iconBg: 'bg-green-100',
  },
  {
    icon: Smile,
    title: '自然持久',
    content:
      '采用德国VITA全瓷材料，透光性与天然牙釉质几乎一致，肉眼无法分辨。配合专业粘接技术，正常使用可维持10-15年，长期美观稳定。',
    color: 'from-purple-100 to-purple-50',
    iconBg: 'bg-purple-100',
  },
];

export default function WhatAreVeneers() {
  const [activeCard, setActiveCard] = useState(null);
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="what-are-veneers" ref={ref} className="w-full py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Education</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            了解<span className="text-gold italic">瓷贴片</span>
          </h2>
          <p className="text-brown-light max-w-2xl mx-auto leading-relaxed">
            瓷贴片是现代美容牙科的一项成熟技术，用最小的创伤换取最大的美学改善。
            <br />
            以下带您全面了解这项改变千万人笑容的技术。
          </p>
        </motion.div>

        {/* Interactive cards grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const isActive = activeCard === i;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-8 transition-all duration-500 overflow-hidden ${
                  isActive
                    ? 'shadow-2xl shadow-gold/10 sm:scale-[1.02] bg-white'
                    : 'bg-white/60 hover:bg-white hover:shadow-xl hover:shadow-brown/5'
                }`}
                onClick={() => setActiveCard(isActive ? null : i)}
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${card.iconBg} flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-brown" />
                  </div>

                  <h3 className="font-serif text-base sm:text-2xl font-semibold text-brown mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    {card.title}
                    <ChevronRight
                      className={`w-3.5 h-3.5 sm:w-5 sm:h-5 text-gold transition-transform duration-300 flex-shrink-0 ${
                        isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                      }`}
                    />
                  </h3>

                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : '0px', opacity: isActive ? 1 : 0.6 }}
                    className="overflow-hidden"
                  >
                    <p className="text-brown-light leading-relaxed">{card.content}</p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
