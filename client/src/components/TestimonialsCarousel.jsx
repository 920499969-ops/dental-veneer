import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: '林女士',
    age: '32岁 · 市场总监',
    text: '因为四环素牙从小不敢露齿笑，做了6颗上牙瓷贴片后，终于可以自信大笑了！医生技术非常好，整个过程几乎没感觉到任何不适。同事都说我笑起来像换了一个人。',
    rating: 5,
    procedure: '前牙美学修复 · 6颗',
  },
  {
    name: '陈先生',
    age: '28岁 · 程序员',
    text: '门牙磕掉了一个角，加上牙缝偏大，一直想修复。对比了好几家，最终选了这里，价格合理，效果超乎预期。修复后完全看不出痕迹，质感跟真牙一样。',
    rating: 5,
    procedure: '缺损修复+关缝 · 4颗',
  },
  {
    name: '张女士',
    age: '45岁 · 企业主',
    text: '这个年纪做瓷贴片本来有点顾虑，面诊时医生详细解答了我所有疑问。做完8颗微笑设计后，整个人年轻了至少十岁！现在是朋友聚会的话题焦点。',
    rating: 5,
    procedure: '微笑全线设计 · 8颗',
  },
  {
    name: '王小姐',
    age: '26岁 · 设计师',
    text: '对美学要求很高，所以选择了DSD数字化微笑设计。医生非常耐心，反复沟通方案和颜色选择。最终效果完全符合我的审美，自然又有质感，朋友们都看不出是做的。',
    rating: 5,
    procedure: 'DSD微笑设计 · 6颗',
  },
];

export default function TestimonialsCarousel() {
  const [ref, isVisible] = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDir) => {
      setDirection(newDir);
      setCurrent((prev) => {
        if (newDir === 1) return (prev + 1) % testimonials.length;
        return (prev - 1 + testimonials.length) % testimonials.length;
      });
    },
    []
  );

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [isVisible, paginate]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <section ref={ref} className="w-full py-24 md:py-32 px-6 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold/3 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Testimonials</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            客户<span className="text-gold italic">好评</span>
          </h2>
        </motion.div>

        <div className="relative" style={{ minHeight: '320px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 md:p-12 text-center shadow-lg shadow-brown/3 border border-brown/5"
            >
              <Quote className="w-10 h-10 text-gold/30 mx-auto mb-6" />
              <p className="text-lg text-brown-light leading-relaxed mb-8 italic">
                "{t.text}"
              </p>
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <div className="font-serif text-xl font-semibold text-brown">{t.name}</div>
              <div className="text-sm text-brown-light/70 mt-1">{t.age}</div>
              <div className="inline-block mt-3 px-4 py-1.5 bg-gold/10 text-gold-dark text-xs rounded-full font-medium">
                {t.procedure}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-gold w-8' : 'bg-brown/15 hover:bg-brown/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
