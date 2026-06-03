import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import MapModal from './MapModal';

export default function Footer() {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <footer className="w-full bg-brown text-cream/60">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-xl font-semibold text-cream">
                  臻白<span className="text-gold">瓷贴片</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-cream/40">
                专注瓷贴片美容牙科，用专业技术和真诚服务，让每一个人都能绽放自信笑容。
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-medium text-cream mb-4">快速导航</h4>
              <ul className="space-y-2.5 text-sm">
                {['了解瓷贴片', '前后对比', '服务流程', '服务方案', '常见问题'].map((item) => (
                  <li key={item}>
                    <a href={`#${item === '了解瓷贴片' ? 'what-are-veneers' : item === '前后对比' ? 'before-after' : item === '服务流程' ? 'process' : item === '服务方案' ? 'pricing' : 'faq'}`}
                      className="hover:text-gold transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-medium text-cream mb-4">联系我们</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="tel:13976387730" className="flex items-center gap-2.5 hover:text-gold transition-colors">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>13976387730</span>
                  </a>
                </li>
                <li>
                  <button onClick={() => { navigator.clipboard.writeText('WUFAER473700385'); }}
                    className="flex items-center gap-2.5 hover:text-gold transition-colors text-left">
                    <MessageCircle className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>微信：WUFAER473700385</span>
                    <span className="text-[10px] text-cream/30">(点击复制)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowMap(true)}
                    className="flex items-start gap-2.5 hover:text-gold transition-colors text-left">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>海南省海口市美兰区瓦灶路3号<br />碧桂园·美舍仕家2栋201</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-medium text-cream mb-4">营业时间</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>周一至周五 9:00 - 18:00</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>周六至周日 9:00 - 17:00</span>
                </li>
              </ul>
              <Link to="/booking"
                className="inline-block mt-5 px-5 py-2.5 bg-gold text-brown rounded-full text-sm font-medium hover:bg-gold-light transition-all">
                在线预约
              </Link>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/30">
            <p>© 2024 臻白瓷贴片工作室. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-cream/50 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-cream/50 transition-colors">服务条款</a>
              <a href="/admin/login" className="hover:text-cream/50 transition-colors">员工入口</a>
            </div>
          </div>
        </div>
      </footer>

      <MapModal isOpen={showMap} onClose={() => setShowMap(false)} />
    </>
  );
}
