import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

/* ====================== 可拖拽浮窗 ====================== */
const BTN_SIZE = 52;
const SNAP_DISTANCE = 60;   // distance from edge to trigger snap
const DRAG_THRESHOLD = 5;   // px moved to count as drag

const TAB_W = 28;  // width of snapped tab
const TAB_H = 90;  // height of snapped tab

function getSnapX(x, side, vw) {
  if (side === 'left') return 0;               // flush left
  if (side === 'right') return vw - TAB_W;     // flush right
  return Math.max(8, Math.min(x, vw - BTN_SIZE - 8));
}

function calcSnap(x, vw) {
  const centerX = x + BTN_SIZE / 2;
  // Only snap if button center is very close to an edge
  if (centerX < SNAP_DISTANCE) return 'left';
  if (centerX > vw - SNAP_DISTANCE) return 'right';
  return null; // free floating!
}

export default function ChatWidget() {
  const navigate = useNavigate();

  /* ---- drag state ---- */
  const [position, setPosition] = useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - BTN_SIZE - 16 : 300,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.65 : 400,
  }));
  const [side, setSide] = useState('right');
  const [isDragging, setIsDragging] = useState(false);
  const [moved, setMoved] = useState(0);
  const movedRef = useRef(0);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const vwRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 375);
  const vhRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 667);

  /* ---- resize handler ---- */
  useEffect(() => {
    const handleResize = () => {
      vwRef.current = window.innerWidth;
      vhRef.current = window.innerHeight;
      setPosition((prev) => {
        const newSide = calcSnap(prev.x, window.innerWidth);
        setSide(newSide);
        const nx = getSnapX(prev.x, newSide, window.innerWidth);
        const h = newSide ? TAB_H : BTN_SIZE;
        const ny = Math.max(60, Math.min(prev.y, window.innerHeight - h - 20));
        return { x: nx, y: ny };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [side]);

  /* ---- drag handlers ---- */
  const handlePointerDown = (e) => {
    // Don't preventDefault — it kills the click event on mobile
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
    movedRef.current = 0;
    setMoved(0);
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const nx = dragRef.current.startPosX + dx;
      const ny = Math.max(60, Math.min(dragRef.current.startPosY + dy, vhRef.current - TAB_H - 20));
      setPosition({ x: nx, y: ny });
      const dist = Math.abs(dx) + Math.abs(dy);
      movedRef.current = dist;
      setMoved(dist);
      setSide(null);
    };
    const handleUp = () => {
      setIsDragging(false);
      const vw = vwRef.current;
      setPosition((prev) => {
        const newSide = calcSnap(prev.x, vw);
        setSide(newSide);
        return { x: getSnapX(prev.x, newSide, vw), y: prev.y };
      });
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  const handleClick = () => {
    if (movedRef.current < DRAG_THRESHOLD) {
      navigate('/chat');
    }
  };

  /* ---- render ---- */
  const btnX = position.x;
  const btnY = position.y;
  const isSnapped = side === 'left' || side === 'right';
  const snappedLeft = side === 'left';

  return (
    <>
      {/* ====== 可拖拽浮窗 ====== */}
        <div
          className="fixed z-[100] select-none touch-none animate-[fadeIn_0.3s_ease]"
          style={{
            left: isSnapped && !isDragging && snappedLeft ? 0 : (isSnapped && !isDragging && !snappedLeft ? 'auto' : btnX),
            right: isSnapped && !isDragging && !snappedLeft ? 0 : 'auto',
            top: btnY,
            width: isSnapped && !isDragging ? TAB_W : BTN_SIZE,
            height: isSnapped && !isDragging ? TAB_H : BTN_SIZE,
            transition: isDragging ? 'none' : 'left 0.35s cubic-bezier(0.22,1,0.36,1), right 0.35s cubic-bezier(0.22,1,0.36,1), top 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          {/* Vertical edge tab — flush to screen edge */}
          {isSnapped && !isDragging && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform select-none"
              style={{
                background: 'linear-gradient(180deg, #C9A96E 0%, #A88B4E 100%)',
                borderRadius: snappedLeft ? '0 14px 14px 0' : '14px 0 0 14px',
                boxShadow: snappedLeft
                  ? '2px 0 12px rgba(201,169,110,0.3)'
                  : '-2px 0 12px rgba(201,169,110,0.3)',
              }}
            >
              <MessageCircle className="w-4 h-4 text-white/90 flex-shrink-0" />
              <span className="text-white/90 text-xs font-medium leading-none" style={{ writingMode: 'vertical-rl' }}>
                客服
              </span>
            </div>
          )}

          {/* Free circle (hidden when snapped) */}
          <motion.div
            animate={{
              opacity: isSnapped && !isDragging ? 0 : 1,
              scale: isSnapped && !isDragging ? 0.01 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-xl shadow-gold/30 flex items-center justify-center"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="absolute inset-0 rounded-full bg-gold/30 animate-ping" style={{ animationDuration: '2.5s' }} />
            <MessageCircle className="w-5 h-5 text-white relative z-10" />
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </motion.div>
        </div>
    </>
  );
}
