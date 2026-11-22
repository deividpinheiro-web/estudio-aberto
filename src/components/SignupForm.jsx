import { useState } from 'react'

const FIELDS = [
  { n: 'nome', l: 'Nome artístico / vulgo', t: 'text' },
  { n: 'bairro', l: 'Bairro / região', t: 'text' },
  { n: 'genero', l: 'Subgênero', t: 'select', o: ['Trap', 'Plugg', 'Drill', 'Boombap', 'R&B', 'Funk'] },
  { n: 'demo', l: 'Link da demo (SoundCloud, YouTube ou Google Drive)', t: 'url', ph: 'https://' },
  { n: 'zap', l: 'WhatsApp', t: 'tel', ph: '(11) 90000-0000' },
  { n: 'historia', l: 'Sua história (release)', t: 'textarea' }
]

// Retorna a mensagem de erro de um campo ('' = válido)
function check(n, raw) {
  const v = raw.trim()
  if (!v) return 'Preencha este campo.'
  if (n === 'nome' && v.length < 2) return 'Use ao menos 2 caracteres.'
  if (n === 'demo' && !/^https?:\/\/(www\.)?(soundcloud\.com|youtu\.be|youtube\.com|drive\.google\.com)\/\S+/i.test(v)) return 'Use um link do SoundCloud, YouTube ou Google Drive.'
  if (n === 'zap' && !/^\(\d{2}\) 9?\d{4}-\d{4}$/.test(v)) return 'Informe DDD e número, ex.: (11) 90000-0000.'
  if (n === 'historia' && v.length < 20) return 'Conte um pouco mais (mínimo de 20 caracteres).'
  return ''
}

const maskPhone = s => {
  const v = s.replace(/\D/g, '').slice(0, 11)
  if (v.length > 6) return `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`
  return v.length > 2 ? `(${v.slice(0, 2)}) ${v.slice(2)}` : v
}

export default function SignupForm() {
  const empty = Object.fromEntries(FIELDS.map(f => [f.n, '']))
  const [vals, setVals] = useState(empty)
  const [errs, setErrs] = useState({})
  const [protocol, setProtocol] = useState('')

  const change = (n, v) => setVals(s => ({ ...s, [n]: n === 'zap' ? maskPhone(v) : v }))
  const blur = n => setErrs(s => ({ ...s, [n]: check(n, vals[n]) }))
  const submit = e => {
    e.preventDefault()
    const all = Object.fromEntries(FIELDS.map(f => [f.n, check(f.n, vals[f.n])]))
    setErrs(all)
    const bad = FIELDS.find(f => all[f.n])
    if (bad) return document.getElementById('f-' + bad.n).focus()
    setProtocol('#EA-2026-' + (Math.floor(Math.random() * 900) + 100))
  }
  const reset = () => { setVals(empty); setErrs({}); setProtocol('') }

  if (protocol) return (
    <div className="card success" role="status">
      <h3>Inscrição recebida!</h3><div className="proto">{protocol}</div>
      <p>Guarde esse número. Entramos em contato pelo WhatsApp para combinar a data da gravação.</p>
      <button className="btn" style={{ marginTop: '1rem' }} onClick={reset}>Fazer nova inscrição</button>
    </div>
  )

  return (
    <form className="card" onSubmit={submit} noValidate>
      {FIELDS.map(f => {
        const p = { id: 'f-' + f.n, name: f.n, value: vals[f.n], 'aria-invalid': !!errs[f.n], onBlur: () => blur(f.n), onChange: e => change(f.n, e.target.value) }
        return (
          <label key={f.n}>{f.l}
            {f.t === 'select' ? <select {...p}><option value="">Selecione</option>{f.o.map(o => <option key={o}>{o}</option>)}</select>
              : f.t === 'textarea' ? <textarea {...p} />
              : <input {...p} type={f.t} placeholder={f.ph} />}
            <span className="err">{errs[f.n]}</span>
          </label>
        )
      })}
      <button className="btn solid" type="submit">Enviar inscrição</button>
    </form>
  )
}
