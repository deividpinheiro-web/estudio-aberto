const fmt = t => {
  if (!isFinite(t)) return '00:00'
  return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(Math.floor(t % 60)).padStart(2, '0')
}

// Barra fixa no rodapé da tela
export default function Player({ p, list }) {
  const a = list[p.cur]
  return (
    <div className="player" role="region" aria-label="Player de áudio">
      <div className="pl">
        <div className="now">
          <div className="thumb" style={{ background: a ? a.grad : undefined }} />
          <div><b>{a ? a.track : 'Escolha uma faixa'}</b><small>{a ? `${a.name} • ${a.origin}` : 'Estúdio Aberto'}</small></div>
        </div>
        <div className="ctrl">
          <div className="btns">
            <button onClick={() => p.step(-1)} aria-label="Faixa anterior">⏮</button>
            <button className="play" onClick={() => p.toggle(p.cur < 0 ? 0 : p.cur)} aria-label={p.playing ? 'Pausar' : 'Tocar'}>{p.playing ? '❚❚' : '▶'}</button>
            <button onClick={() => p.step(1)} aria-label="Próxima faixa">⏭</button>
          </div>
          <div className="bar">
            <span>{fmt(p.time)}</span>
            <input id="seek" type="range" min="0" max="100" step="0.1" value={p.dur ? (p.time / p.dur) * 100 : 0}
              onChange={e => p.seek(+e.target.value)} aria-label="Progresso da faixa" />
            <span>{fmt(p.dur)}</span>
          </div>
        </div>
        <div className="vol"><span aria-hidden="true">🔊</span>
          <input type="range" min="0" max="1" step="0.01" value={p.vol} onChange={e => p.setVol(+e.target.value)} aria-label="Volume" />
        </div>
      </div>
      {p.error && <div role="alert" className="err" style={{ textAlign: 'center' }}>{p.error}</div>}
      <audio {...p.bind} />
    </div>
  )
}
