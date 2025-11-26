import { useEffect, useState, useMemo } from 'react'
import Chart from './components/Chart/Chart'
import styles from './App.module.css'

type Variation = { id?: number; name: string }
type DataPoint = { date: string; visits: Record<string, number>; conversions: Record<string, number> }

export default function App() {
  const [raw, setRaw] = useState<{ variations: Variation[]; data: DataPoint[] } | null>(null)
  const [mode, setMode] = useState<'day' | 'week'>('day')
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then((r) => r.json())
      .then((d) => setRaw(d))
  }, [])

  useEffect(() => {
    if (!raw) return
    const init: Record<string, boolean> = {}
    raw.variations.forEach((v) => {
      init[v.name] = true
    })
    setVisible(init)
  }, [raw])

  const variants = useMemo(() => {
    if (!raw) return []
    return raw.variations.map((v) => ({
      name: v.name,
      data: raw.data.map((d) => ({
        date: d.date,
        visits: d.visits[v.id?.toString() ?? '0'] ?? 0,
        conversions: d.conversions[v.id?.toString() ?? '0'] ?? 0,
      })),
    }))
  }, [raw])

  const toggleVariant = (name: string) => {
    setVisible((v) => {
      const next = { ...v }
      const enabledCount = Object.values(next).filter(Boolean).length
      if (next[name] && enabledCount === 1) return v
      next[name] = !next[name]
      return next
    })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <div className={styles.block}>
          <div className={styles.title}>Варианты</div>
          <div className={styles.list}>
            {variants.map((v) => (
              <label key={v.name} className={styles.item}>
                <input
                  type="checkbox"
                  checked={visible[v.name] ?? false}
                  onChange={() => toggleVariant(v.name)}
                />
                {v.name}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.block}>
          <div className={styles.title}>Группировка</div>
          <div className={styles.list}>
            <label className={styles.item}>
              <input
                type="radio"
                name="mode"
                checked={mode === 'day'}
                onChange={() => setMode('day')}
              />
              День
            </label>
            <label className={styles.item}>
              <input
                type="radio"
                name="mode"
                checked={mode === 'week'}
                onChange={() => setMode('week')}
              />
              Неделя
            </label>
          </div>
        </div>
      </div>
      {raw && <Chart variants={variants} visible={visible} mode={mode} />}
    </div>
  )
}