import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create tooth-shaped particles
    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4 - 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.angleSpeed;

        if (this.y < -10 || this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#C9A96E';

        // Draw tooth shape
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 3);
        ctx.bezierCurveTo(s * 2, -s * 3, s * 2.5, -s, s * 1.5, s);
        ctx.bezierCurveTo(s, s * 2, -s, s * 2, -s * 1.5, s);
        ctx.bezierCurveTo(-s * 2.5, -s, -s * 2, -s * 3, 0, -s * 3);
        ctx.fill();

        // Shine
        ctx.fillStyle = '#FFFBF5';
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.beginPath();
        ctx.ellipse(0, -s * 1.5, s * 0.5, s * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    const PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      // Draw subtle connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 169, 110, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(180deg, #FFFBF5 0%, #F5EDE4 50%, #FFFBF5 100%)' }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-cream/60 via-transparent to-cream/60" />

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm text-gold-dark font-medium">专业瓷贴片美容牙工作室</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-brown leading-[1.05] mb-3 sm:mb-6 tracking-tight"
        >
          自信笑容
          <br />
          <span className="text-gold italic">从「齿」开始</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-brown-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          德国进口全瓷材料，微创不磨牙，1小时焕新微笑。
          <br className="hidden md:block" />
          每位客户均由10年经验主治医师亲自操作，品质有保障。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/booking"
            className="group px-8 py-4 bg-brown text-cream rounded-full text-base font-medium hover:bg-brown-light transition-all duration-300 hover:shadow-xl hover:shadow-brown/20 active:scale-95 flex items-center gap-2"
          >
            立即预约免费面诊
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#what-are-veneers"
            className="px-8 py-4 text-brown-light hover:text-brown rounded-full text-base font-medium border border-brown/15 hover:border-brown/30 transition-all duration-300"
          >
            了解更多 ↓
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-12 border-t border-brown/8"
        >
          {[
            { num: '500+', label: '满意客户' },
            { num: '10年+', label: '临床经验' },
            { num: '5年', label: '质量保障' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-3xl md:text-4xl font-bold text-gold">{stat.num}</div>
              <div className="text-sm text-brown-light mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
