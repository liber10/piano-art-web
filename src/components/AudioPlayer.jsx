import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      // Плавное нарастание громкости
      audioRef.current.volume = 0;
      let vol = 0;
      const interval = setInterval(() => {
        if (vol < 1) {
          vol += 0.1;
          audioRef.current.volume = Math.min(vol, 1);
        } else {
          clearInterval(interval);
        }
      }, 200);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Скрытый аудио-элемент */}
      <audio ref={audioRef} src="/melody.mp3" loop />

      <button 
        onClick={togglePlay}
        className="group flex items-center justify-center gap-3 text-white/60 hover:text-gold-accent transition-all duration-300 uppercase tracking-widest text-sm"
      >
        <div className={`p-3 border border-white/20 rounded-full group-hover:border-gold-accent transition-colors ${isPlaying ? 'animate-pulse border-gold-accent text-gold-accent' : ''}`}>
           {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </div>
        
        <span>{isPlaying ? 'Играет музыка...' : 'Послушать'}</span>
      </button>

      {/* Анимация эквалайзера (появляется только когда играет) */}
      {isPlaying && (
        <div className="flex gap-1 h-4 items-end">
          <div className="w-0.5 bg-gold-accent animate-[bounce_1s_infinite] h-2"></div>
          <div className="w-0.5 bg-gold-accent animate-[bounce_1.2s_infinite] h-4"></div>
          <div className="w-0.5 bg-gold-accent animate-[bounce_0.8s_infinite] h-3"></div>
        </div>
      )}
    </div>
  );
}