import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
} from 'recharts'
import styles from './Chart.module.css'
import { formatPercent } from '../../utils/format'
import { useMemo } from 'react'

type Point = { date: string; visits: number; conversions: number }
type Variant = { name: string; data: Point[] }

type Props = {
    variants: Variant[]
    visible: Record<string, boolean>
    mode: 'day' | 'week'
}

function calcCR(p?: Point | null) {
  if (!p || p.visits === undefined) return null
  return p.visits ? (p.conversions / p.visits) * 100 : 0
}

function aggregateWeek(data: Point[]) {
    const map = new Map<string, { visits: number; conversions: number; date: string }>()
    data.forEach((p) => {
        const d = new Date(p.date)
        const day = d.getDay()
        const diff = (day + 6) % 7
        const start = new Date(d)
        start.setHours(0, 0, 0, 0)
        start.setDate(d.getDate() - diff)
        const key = start.toISOString().slice(0, 10)
        const curr = map.get(key) || { visits: 0, conversions: 0, date: key }
        curr.visits += p.visits
        curr.conversions += p.conversions
        map.set(key, curr)
    })
    return Array.from(map.values()).map((v) => ({ date: v.date, visits: v.visits, conversions: v.conversions }))
}

export default function Chart({ variants, visible, mode }: Props) {
    const colors = ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

    const prepared = useMemo(() => {
        const allDates = new Set<string>()
        const perVariant = variants.map((v) => {
            const data = mode === 'day' ? v.data : aggregateWeek(v.data)
            data.forEach((p) => allDates.add(p.date))
            return { name: v.name, data }
        })

        const dates = Array.from(allDates).sort()
        const rows = dates.map((d) => {
            const row: Record<string, any> = { date: d }
            perVariant.forEach((pv) => {
                const p = pv.data.find((x) => x.date === d) ?? null
                row[`${pv.name}_visits`] = p?.visits ?? 0
                row[`${pv.name}_conversions`] = p?.conversions ?? 0
                row[`${pv.name}_cr`] = calcCR(p)
            })
            return row
        })
        return { rows, perVariant }
    }, [variants, mode])

    const yDomain = useMemo(() => {
        let min = Infinity
        let max = -Infinity
        prepared.rows.forEach((r) => {
            variants.forEach((v) => {
                if (!visible[v.name]) return
                const val = r[`${v.name}_cr`]
                if (val !== null && val !== undefined) {
                    min = Math.min(min, val)
                    max = Math.max(max, val)
                }
            })
        })
        if (min === Infinity) {
            return [0, 100] as [number, number]
        }
        const pad = (max - min) * 0.12 || max * 0.12 || 1
        const lower = Math.max(0, min - pad)
        const upper = max + pad
        return [lower, upper] as [number, number]
    }, [prepared.rows, variants, visible])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload) return null
        return (
            <div style={{ background: 'var(--bg)', padding: 8, borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
                {variants.map((v, idx) =>
                    visible[v.name] ? (
                        <div key={v.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ width: 10, height: 10, background: colors[idx % colors.length], borderRadius: 3 }} />
                            <div style={{ minWidth: 40, fontWeight: 600 }}>{v.name}</div>
                            <div>{formatPercent(payload.find((p: any) => p.dataKey === `${v.name}_cr`)?.value ?? null)}</div>
                        </div>
                    ) : null
                )}
            </div>
        )
    }

    const xTickFormatter = (s: string) => {

        try {
            const d = new Date(s)
            return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`
        } catch {
            return s
        }
    }

    return (
        <div className={styles.chartWrap}>
            <div className={styles.legend}>
                {variants.map((v, idx) => (
                    <div key={v.name} className={styles.legendItem}>
                        <div className={styles.legendColor} style={{ background: colors[idx % colors.length] }} />
                        <div>{v.name}</div>
                    </div>
                ))}
            </div>

            <ResponsiveContainer width="100%" height={380}>
                <LineChart data={prepared.rows}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={xTickFormatter} />
                    <YAxis domain={yDomain} tickFormatter={(v) => (v === null || v === undefined ? '-' : `${Number(v).toFixed(1)}%`)} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1 }} />

                    {variants.map((v, idx) =>
                        visible[v.name] ? (
                            <Line
                                key={v.name}
                                type="monotone"
                                dataKey={`${v.name}_cr`}
                                stroke={colors[idx % colors.length]}
                                dot={false}
                                strokeWidth={2}
                                isAnimationActive={false}
                                connectNulls={true}
                            />
                        ) : null
                    )}

                    <Brush dataKey="date" height={30} stroke="#8884d8" travellerWidth={10} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}