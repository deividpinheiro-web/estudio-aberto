import { useEffect, useState } from 'react'

// useState que guarda o valor no localStorage (preferências e favoritos sobrevivem ao recarregar)
export function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* modo privado */ } }, [key, value])
  return [value, setValue]
}
