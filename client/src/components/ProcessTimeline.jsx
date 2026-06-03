import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { ClipboardCheck, Scan, Sparkles, Smile } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: '初次面诊',
    duration: '约30分钟',
    desc: '医生一对一沟通，了解您的期望，检查牙齿状况，评估是否适合做瓷贴片。现场拍照、取模，制定个性化方案。',
    detail: '免费 · 无隐性消费',
  },
  {
    icon: Scan,
    title: '数字化设计',
    duration: '约1周',
    desc: '采用3D口腔扫描技术获取精准数字印模，技师在模型上为您定制设计贴片形态、颜色，制作诊断蜡型供您预览效果。',
    detail: '德国VITA比色 · 精准匹配',
  },
  {
    icon: Sparkles,
    title: '贴片制作与试戴',
    duration: '约1-2周',
    desc: '在专业技工中心精细制作您的专属瓷贴片。制作完成后预约试戴，检查贴合度、颜色、形态，微调至完美。',
    detail: '全手工制作 · 层层把关',
  },
  {
    icon: Smile,
    title: '粘接完成',
    duration: '约1-2小时',
    desc: '牙齿表面做专业处理后，使用德国进口树脂粘接剂将贴片精准定位、光固化。最后检查咬合，抛光，完成！',
    detail: '即刻拥有 · 自信笑容',
  },
];

export default function ProcessTimeline() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="process" ref={ref} className="w-full py-24 md:py-32 px-6 bg-gradient-to-b from-cream to-warm-pink/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gold/3 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Process</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            服务<span className="text-gold italic">流程</span>
          </h2>
          <p className="text-brown-light max-w-2xl mx-auto">
            从初诊到绽放笑容，每一步都专业透明
          </p>
        </motion.div>

        {/* 2-col grid on mobile, alternating timeline on desktop */}
        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/20 -translate-x-1/2" />

          {/* Mobile: 2-column grid / Desktop: alternating timeline */}
          <div className="grid grid-cols-2 lg:block gap-3 sm:gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`lg:flex lg:items-center lg:mb-16 last:mb-0 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div className={`lg:flex-1 ${isLeft ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-brown/5 transition-all duration-300 border border-brown/3 h-full">
                      <div className={`flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4 ${isLeft ? 'lg:justify-end' : ''}`}>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-gold" />
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs text-gold font-medium">Step {i + 1}</span>
                          <h3 className="font-serif text-sm sm:text-xl font-semibold text-brown">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-brown-light text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-3 sm:line-clamp-none">{step.desc}</p>
                      <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs flex-wrap">
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gold/10 text-gold-dark rounded-full font-medium">
                          {step.duration}
                        </span>
                        <span className="text-brown-light/60 hidden sm:inline">{step.detail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot (desktop only) */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold shadow-lg shadow-gold/20 border-4 border-cream z-10 items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  {/* Spacer (desktop only) */}
                  <div className="hidden lg:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
