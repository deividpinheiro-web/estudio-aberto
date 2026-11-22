import { useEffect, useState } from 'react'
import { ARTISTS, GENRES } from './data.js'
import { usePlayer } from './hooks/usePlayer.js'
import { usePersisted } from './hooks/usePersisted.js'
import Player from './components/Player.jsx'
import SignupForm from './components/SignupForm.jsx'

const NAV = [['projeto', 'O Projeto'], ['artistas', 'Artistas & Faixas'], ['roteiro', 'Roteiro Móvel'], ['inscricao', 'Inscreva seu Som']]
const STATS = [['20 Artistas', 'Gravados por edição'], ['4 Regiões', 'ZL, ZS, ZN e Baixada/ZO'], ['100% Gratuito', 'Acesso democratizado'], ['40k+ Plays', 'Alcance comunitário']]
const PILLARS = [
  ['🚐', 'Estúdio Itinerante', 'Unidade móvel equipada que chega aos centros culturais e escolas públicas, com cabine de gravação tratada e equipe técnica.'],
  ['🎚️', 'Produção & Selo Digital', 'Gravação de faixa autoral, orientação sobre direitos autorais (ECAD/UBC) e lançamento no Spotify e no YouTube.'],
  ['🎤', 'Festival de Encerramento', 'Show gratuito ao ar livre reunindo na comunidade todos os artistas gravados.']
]
const STOPS = [
  ['Mês 1', 'Zona Oeste (Itapevi)', 'Centro Cultural Municipal', 'Concluído', 'done'],
  ['Mês 2', 'Baixada Santista (São Vicente)', 'Casa da Cultura', 'Concluído', 'done'],
  ['Mês 3', 'Zona Norte (Brasilândia)', 'Fábrica de Cultura', 'Em andamento • Vagas Abertas', 'live'],
  ['Mês 4', 'Zona Leste (Cidade Tiradentes)', 'Centro de Formação Cultural', 'Em breve', '']
]

// Idade calculada a partir da data de nascimento (não fica desatualizada)
const ageOf = iso => {
  const [y, m, d] = iso.split('-').map(Number), n = new Date()
  let r = n.getFullYear() - y
  if (n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) r--
  return r
}

// Modal com bio e letra; fecha com Esc ou clique fora
function Modal({ a, onClose }) {
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle">
        <button className="close" autoFocus onClick={onClose} aria-label="Fechar">✕</button>
        {a.photo && <img className="m-photo" src={import.meta.env.BASE_URL + a.photo} alt={'Foto de ' + a.name} />}
        <h3 id="mTitle">{a.name}</h3><div className="sub">{a.track} • {a.origin}</div>
        <h4>Bio</h4>
        {(a.realName || a.birth) && <p className="real">{[a.realName && 'Nome verdadeiro: ' + a.realName, a.birth && ageOf(a.birth) + ' anos'].filter(Boolean).join(' • ')}</p>}
        <p>{a.bio}</p>
        <h4>Letra</h4>
        {a.lyricsUrl
          ? <p><a className="link" href={a.lyricsUrl} target="_blank" rel="noopener noreferrer">Ler a letra completa no Letras.mus.br</a></p>
          : <p className="lyrics">{a.lyrics}</p>}
      </div>
    </div>
  )
}

export default function App() {
  const [fontPct, setFontPct] = usePersisted('ea-font', 100)
  const [hc, setHc] = usePersisted('ea-hc', false)
  const [favs, setFavs] = usePersisted('ea-favs', [])
  const [genre, setGenre] = useState('Todos')
  const [query, setQuery] = useState('')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [menu, setMenu] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const player = usePlayer(ARTISTS)

  useEffect(() => { document.documentElement.style.fontSize = fontPct + '%' }, [fontPct])
  useEffect(() => { document.body.classList.toggle('hc', hc) }, [hc])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t) } }, [toast])

  const setFont = v => setFontPct(Math.min(130, Math.max(80, v)))
  const toggleFav = n => setFavs(f => f.includes(n) ? f.filter(x => x !== n) : [...f, n])
  const visible = ARTISTS.map((a, i) => ({ a, i })).filter(({ a }) =>
    (genre === 'Todos' || a.genre === genre) &&
    (!onlyFavs || favs.includes(a.name)) &&
    (a.name + ' ' + a.track + ' ' + a.origin).toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <>
      <a className="skip" href="#projeto">Pular para o conteúdo</a>

      <div className="access" role="region" aria-label="Acessibilidade">
        <div className="wrap">
          <span>Acessibilidade</span>
          <button onClick={() => setFont(fontPct + 10)} aria-label="Aumentar tamanho da fonte">A+</button>
          <button onClick={() => setFont(fontPct - 10)} aria-label="Diminuir tamanho da fonte">A-</button>
          <button onClick={() => setHc(!hc)} aria-pressed={hc}>Alto Contraste</button>
        </div>
      </div>

      <header className="top">
        <div className="wrap">
          <a href="#inicio" className="logo" aria-label="Estúdio Aberto, início">
            <span className="wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>ESTÚDIO ABERTO
          </a>
          <nav className={menu ? 'open' : ''} aria-label="Principal">
            <ul>{NAV.map(([id, l]) => <li key={id}><a href={'#' + id} onClick={() => setMenu(false)}>{l}</a></li>)}</ul>
          </nav>
          <a href="#inscricao" className="btn solid cta-top">Enviar Demo</a>
          <button className="burger" onClick={() => setMenu(!menu)} aria-label="Abrir menu" aria-expanded={menu}>☰</button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero"><div className="wrap">
          <span className="tag">PROJETO CULTURAL • 100% GRATUITO</span>
          <h1>Sua voz merece estúdio. O trap da quebrada sem barreiras.</h1>
          <p className="lead">Estúdio móvel itinerante com gravação profissional, mixagem, masterização e distribuição digital gratuita nas plataformas para artistas independentes.</p>
          <div className="actions">
            <a href="#artistas" className="btn solid">▶ Ouvir Lançamentos</a>
            <a href="#inscricao" className="btn">Agendar Gravação</a>
          </div>
          <div className="stats">{STATS.map(([b, s]) => <div className="card stat" key={b}><b>{b}</b><small>{s}</small></div>)}</div>
        </div></section>

        <section id="projeto"><div className="wrap">
          <h2 className="sec-title">Como o Estúdio Aberto funciona</h2>
          <p className="sec-sub">Do beat ao streaming, o estúdio vai até o artista. Sem taxa, sem intermediário e com orientação em cada etapa.</p>
          <div className="grid3">{PILLARS.map(([i, t, d]) => <article className="card pillar" key={t}><div className="ico" aria-hidden="true">{i}</div><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div></section>

        <section id="artistas"><div className="wrap">
          <h2 className="sec-title">Artistas &amp; Lançamentos</h2>
          <p className="sec-sub">Aperte o play, leia a letra, favorite quem você curtiu e conheça a história de quem saiu da quebrada para o mundo.</p>
          <div className="filters" role="group" aria-label="Filtrar por subgênero">
            {GENRES.map(g => <button key={g} className="chip" aria-pressed={g === genre} onClick={() => setGenre(g)}>{g}</button>)}
          </div>
          <div className="tools">
            <input type="search" placeholder="Buscar artista, faixa ou bairro" value={query} onChange={e => setQuery(e.target.value)} aria-label="Buscar no catálogo" />
            <button className="chip" aria-pressed={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)}>♥ Só favoritos ({favs.length})</button>
          </div>
          <div className="catalog" aria-live="polite">
            {visible.map(({ a, i }) => {
              const on = player.cur === i && player.playing
              return (
                <article key={a.name} className={'card' + (on ? ' playing' : '')}>
                  <div className="art" style={{ background: a.grad }}>
                    {a.photo ? <img src={import.meta.env.BASE_URL + a.photo} alt={'Foto de ' + a.name} loading="lazy" /> : <span aria-hidden="true">{a.name.slice(0, 2)}</span>}
                    <div className="eq" aria-hidden="true"><i /><i /><i /><i /></div>
                  </div>
                  <div className="info">
                    <h3>{a.name}</h3><div className="trk">{a.track}</div>
                    <div className="meta">{a.origin} • {a.dur}</div><span className="genre">{a.genre}</span>
                    <div className="row">
                      <button className="play" onClick={() => player.toggle(i)} aria-label={(on ? 'Pausar ' : 'Tocar ') + a.track}>{on ? '❚❚' : '▶'}</button>
                      <button className="link" onClick={() => setModal(a)}>Ver Letra &amp; Bio</button>
                      <a className="link" href={a.link} target="_blank" rel="noopener noreferrer">Ouvir no Spotify</a>
                      <button className="fav" aria-pressed={favs.includes(a.name)} onClick={() => toggleFav(a.name)} aria-label={'Favoritar ' + a.name}>♥</button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          {!visible.length && <p className="empty">Nenhum artista encontrado. Tente outro filtro ou termo de busca.</p>}
        </div></section>

        <section id="roteiro"><div className="wrap">
          <h2 className="sec-title">Roteiro do Estúdio Móvel</h2>
          <p className="sec-sub">Quatro paradas, quatro regiões. A vaga aberta agora é na Zona Norte.</p>
          <div className="timeline">{STOPS.map(([m, t, l, s, c]) =>
            <article className={'card stop ' + c} key={m}><div className="mes">{m}</div><h3>{t}</h3><p>{l}</p><span className="status">{s}</span></article>)}
          </div>
        </div></section>

        <section id="inscricao"><div className="wrap">
          <h2 className="sec-title">Inscreva seu Som</h2>
          <p className="sec-sub">Preencha o formulário, envie o link da sua demo e a equipe chama você no WhatsApp.</p>
          <div className="form-box">
            <SignupForm />
            <aside className="side">
              <p>Como funciona depois do envio:</p>
              <ul>
                <li>Ouvimos todas as demos enviadas, sem custo de inscrição.</li>
                <li>Você recebe a data da sessão na parada mais próxima.</li>
                <li>Grava, recebe a mixagem e a masterização e lança nas plataformas.</li>
                <li>Seu release e seus direitos autorais ficam com você.</li>
              </ul>
            </aside>
          </div>
        </div></section>
      </main>

      <footer><div className="wrap">
        <div className="foot">
          <div><h4>Estúdio Aberto — Som da Quebrada</h4><p>Projeto cultural gratuito que leva gravação, mixagem, masterização e distribuição digital a artistas independentes de trap e rap nas periferias.</p></div>
          <div><h4>Transparência</h4><button className="btn" onClick={() => setToast('Protótipo: o PDF do guia será disponibilizado em breve.')}>⬇ Guia do Artista Independente (PDF)</button></div>
          <div><h4>Apoio e incentivo</h4><div className="seals"><span className="seal">Lei de Incentivo</span><span className="seal">Apoio cultural</span><span className="seal">Parceiros</span></div></div>
        </div>
        <p className="note">Protótipo de plataforma cultural. Faixas de áudio demonstrativas livres de direitos autorais.</p>
      </div></footer>

      {modal && <Modal a={modal} onClose={() => setModal(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
      <Player p={player} list={ARTISTS} />
    </>
  )
}
