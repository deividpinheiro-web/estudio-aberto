import { useEffect, useRef, useState } from 'react'

// Controla o <audio>: faixa atual, play/pause, anterior/próxima, progresso e volume
export function usePlayer(list) {
  const ref = useRef(null)
  const [cur, setCur] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)
  const [vol, setVol] = useState(0.8)
  const [error, setError] = useState('')

  useEffect(() => { if (ref.current) ref.current.volume = vol }, [vol])

  const load = i => { setCur(i); setError(''); ref.current.src = /^https?:/.test(list[i].audio) ? list[i].audio : import.meta.env.BASE_URL + list[i].audio }
  const play = () => ref.current.play().catch(() => setError('Não foi possível tocar o áudio. Verifique sua conexão.'))
  const toggle = i => { if (i !== cur) { load(i); play() } else if (playing) ref.current.pause(); else play() }
  const step = d => { load(cur < 0 ? 0 : (cur + d + list.length) % list.length); play() }
  const seek = pct => { if (dur) ref.current.currentTime = (pct / 100) * dur }

  // props que ligam o elemento <audio> ao estado
  const bind = {
    ref, preload: 'none',
    onPlay: () => setPlaying(true), onPause: () => setPlaying(false), onEnded: () => step(1),
    onTimeUpdate: e => setTime(e.target.currentTime),
    onLoadedMetadata: e => setDur(e.target.duration),
    onError: () => cur >= 0 && setError('Erro ao carregar a faixa.')
  }
  return { bind, cur, playing, time, dur, vol, setVol, toggle, step, seek, error }
}
