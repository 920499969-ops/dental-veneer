import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: '瓷贴片会伤害牙齿吗？需要磨牙吗？',
    a: '瓷贴片是一种微创美容技术。大多数情况下仅需在牙釉质表面做0.2-0.5mm的微量预备（约为指甲厚度的一半），有时甚至完全不需要磨牙。相比传统烤瓷牙需要磨除大量牙体组织，瓷贴片对牙齿的保护是最优的选择。',
  },
  {
    q: '瓷贴片能维持多久？会变色吗？',
    a: '采用德国VITA全瓷材料和专业粘接技术，在正确维护下，瓷贴片可使用10-15年甚至更久。全瓷材料本身不会变色，但需要注意口腔卫生，定期洁牙，避免用贴片牙咬过硬的食物（如螃蟹壳、骨头等）。',
  },
  {
    q: '做瓷贴片疼吗？需要打麻药吗？',
    a: '整个过程基本无痛。牙面微量预备时可能会有轻微酸感，但绝大多数人不需要麻药即可完成。如果牙齿本身比较敏感，医生会使用表面麻醉，确保全程舒适。',
  },
  {
    q: '做完瓷贴片后如何维护？',
    a: '日常维护非常简单：正常刷牙、使用牙线即可。建议每半年至一年进行一次专业洁牙和贴片检查。避免用贴片牙啃咬过硬食物。如果夜间有磨牙习惯，医生会建议佩戴夜间护齿器。',
  },
  {
    q: '瓷贴片和烤瓷牙、树脂贴面有什么区别？',
    a: '瓷贴片在美观度、耐用性和生物相容性上远优于树脂贴面。相比烤瓷牙，瓷贴片磨牙量极少，能最大程度保留健康牙体。简单来说：瓷贴片是"给牙齿做美甲"，烤瓷牙是"给牙齿戴帽子"，前者更微创。',
  },
  {
    q: '所有人都适合做瓷贴片吗？',
    a: '大部分人都适合。但以下情况需要先做处理：严重的蛀牙需先补牙、重度牙周病需先治疗、严重的牙齿排列不齐建议先矫正。我们会在免费面诊时做全面评估，给出最适合您的方案。',
  },
  {
    q: '预约后多久能安排面诊？流程是怎样的？',
    a: '通常在您预约后24小时内，工作人员会电话与您确认面诊时间。面诊约30分钟，包括口腔检查、拍照、沟通需求和方案介绍，全程免费且无消费压力。',
  },
];

export default function FAQSection() {
  const [ref, isVisible] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" ref={ref} className="w-full py-24 md:py-32 px-6 bg-warm-pink/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">FAQ</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            常见<span className="text-gold italic">问题</span>
          </h2>
          <p className="text-brown-light">
            关于瓷贴片，您想知道的都在这里
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === i
                  ? 'bg-white border-gold/30 shadow-lg shadow-gold/5'
                  : 'bg-white/60 border-transparent hover:border-brown/10 hover:bg-white'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-brown pr-4">{faq.q}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === i ? 'bg-gold text-white rotate-180' : 'bg-brown/5 text-brown-light'
                  }`}
                >
                  {openIndex === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-brown-light text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
