import { useState, useEffect } from 'react';

/**
 * BUG #6 — O Cronômetro Acelerado
 *
 * O useEffect que configura o setInterval NÃO possui uma função de cleanup.
 * Cada vez que "rodando" muda para true, um NOVO setInterval é criado
 * sem limpar o anterior. Clicar Iniciar → Pausar → Iniciar cria intervalos
 * duplicados, fazendo o timer acelerar.
 */
export default function Timer() {
  const [segundos, setSegundos] = useState(0);
  const [rodando, setRodando] = useState(false);

  // 🐛 BUG #6: Falta o cleanup (return () => clearInterval(...))
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
