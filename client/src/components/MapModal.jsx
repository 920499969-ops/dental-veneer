import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, ExternalLink } from 'lucide-react';

const ADDRESS = '海南省海口市美兰区瓦灶路3号碧桂园美舍仕家2栋201';
const LAT = '20.028';
const LNG = '110.355';
const NAME = '臻白瓷贴片工作室';

const mapOptions = [
  {
    name: '高德地图',
    icon: '🗺️',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    url: `https://uri.amap.com/marker?position=${LNG},${LAT}&name=${encodeURIComponent(NAME)}&callnative=1`,
  },
  {
    name: '百度地图',
    icon: '📍',
    color: 'bg-red-50 text-red-700 border-red-100',
    url: `https://api.map.baidu.com/marker?location=${LAT},${LNG}&title=${encodeURIComponent(NAME)}&content=${encodeURIComponent(ADDRESS)}&output=html`,
  },
  {
    name: '腾讯地图',
    icon: '🧭',
    color: 'bg-green-50 text-green-700 border-green-100',
    url: `https://apis.map.qq.com/uri/v1/marker?marker=coord:${LAT},${LNG};title:${encodeURIComponent(NAME)};addr:${encodeURIComponent(ADDRESS)}&referer=zhenbai`,
  },
  {
    name: 'Apple 地图',
    icon: '🍎',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    url: `https://maps.apple.com/?q=${encodeURIComponent(NAME)}&ll=${LAT},${LNG}`,
  },
];

export default function MapModal({ isOpen, onClose }) {
  const handleOpen = (url) => {
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px] z-[201] bg-white rounded-3xl shadow-2xl shadow-brown/20 border border-brown/5 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-brown/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-brown text-sm">选择导航方式</h3>
                  <p className="text-xs text-brown-light/50 truncate">{ADDRESS}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-brown/5 hover:bg-brown/10 flex items-center justify-center text-brown-light">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Map options */}
            <div className="p-3 space-y-2">
              {mapOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => handleOpen(opt.url)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${opt.color}`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">点击跳转导航</div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-40" />
                </button>
              ))}
            </div>

            {/* Copy address */}
            <div className="p-4 bg-cream/50 border-t border-brown/5">
              <button
                onClick={() => { navigator.clipboard.writeText(ADDRESS); onClose(); }}
                className="w-full py-3 rounded-2xl bg-white border border-brown/10 text-brown text-sm font-medium hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                复制地址
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
