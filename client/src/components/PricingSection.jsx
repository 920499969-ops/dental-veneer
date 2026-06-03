import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { Check, Sparkles, Star, ArrowRight, Phone } from 'lucide-react';

const plans = [
  {
    name: '前牙美学修复',
    teeth: '2-4颗',
    popular: false,
    features: [
      '德国VITA全瓷材料',
      '专业比色匹配',
      '微创预备技术',
      '3D数字化设计',
      '1年免费维护',
    ],
    color: 'border-brown/10',
    bgGradient: 'from-cream to-warm-pink/30',
  },
  {
    name: '微笑全线设计',
    teeth: '6-8颗',
    popular: true,
    features: [
      '包含前牙套餐所有服务',
      'DSD数字化微笑设计',
      '诊断蜡型预览效果',
      '牙龈美学修整',
      '咬合关系优化',
      '2年免费维护',
      '赠送美白护理1次',
    ],
    color: 'border-gold',
    bgGradient: 'from-gold/5 to-gold/10',
    badge: '最受欢迎',
  },
  {
    name: '全口美学重建',
    teeth: '12-20颗',
    popular: false,
    features: [
      '包含微笑设计所有服务',
      '全面咬合重建评估',
      '颌面美学分析',
      '个性化牙龈塑形',
      '全口协调设计',
      '3年免费维护',
      '赠送年度检查2次',
      'VIP专享绿色通道',
    ],
    color: 'border-brown/10',
    bgGradient: 'from-cream to-warm-pink/30',
  },
];

export default function PricingSection() {
  const [ref, isVisible] = useScrollReveal();
  const [hoveredPlan, setHoveredPlan] = useState(null);

  return (
    <section id="pricing" ref={ref} className="w-full py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-gold font-medium">Services</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-brown mt-3 mb-4">
            服务<span className="text-gold italic">方案</span>
          </h2>
          <p className="text-brown-light max-w-2xl mx-auto">
            每个人的牙齿状况不同，面诊后制定专属方案和报价，确保最合适的美学效果
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredPlan(i)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl sm:rounded-3xl border-2 ${plan.color} bg-gradient-to-b ${plan.bgGradient} p-5 sm:p-8 transition-all duration-500 ${
                hoveredPlan === i ? 'sm:scale-[1.03] sm:shadow-2xl sm:shadow-brown/10 sm:-translate-y-2' : ''
              } ${plan.popular ? 'sm:scale-105' : ''}`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brown text-cream text-xs font-medium rounded-full flex items-center gap-1.5 shadow-lg shadow-brown/20">
                  <Star className="w-3.5 h-3.5 fill-cream" />
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-8 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brown/5 rounded-full text-xs text-brown-light mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  {plan.teeth}
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-semibold text-brown mb-3 sm:mb-4">{plan.name}</h3>
                {/* Price hidden - consultation required */}
                <div className="inline-flex flex-col items-center gap-2 px-5 py-4 bg-gold/5 rounded-2xl border border-gold/10">
                  <Phone className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-gold-dark">面诊获取专属报价</span>
                  <span className="text-xs text-brown-light/50">免费咨询 · 无消费压力</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-brown-light">
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/booking"
                className={`block text-center py-3.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'bg-brown text-cream hover:bg-brown-light hover:shadow-lg hover:shadow-brown/20'
                    : 'border-2 border-brown/15 text-brown hover:border-brown hover:bg-brown hover:text-cream'
                } flex items-center justify-center gap-2 group`}
              >
                预约免费面诊
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-xs text-brown-light/60 mt-10"
        >
          面诊约30分钟 · 免费咨询 · 医生1对1沟通 · 支持分期付款
        </motion.p>
      </div>
    </section>
  );
}
