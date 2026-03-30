import { useState, useEffect } from 'react';

export default function Timer() {
  const [segundos, setSegundos] = useState(0);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    if (rodando) {
      setInterval(() => {
        setSegundos((s) => s + 1);
      }, 1000);
    }
  }, [rodando]);

  const formatarTempo = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <>
      <span className="timer-display">{formatarTempo(segundos)}</span>
      <button
        className="btn-timer"
        onClick={() => setRodando(!rodando)}
      >
        {rodando ? '⏸ Pausar' : '▶ Iniciar'}
      </button>
      <button
        className="btn-timer"
        onClick={() => {
          setRodando(false);
          setSegundos(0);
        }}
      >
        ↺ Reset
      </button>
    </>
  );
}
