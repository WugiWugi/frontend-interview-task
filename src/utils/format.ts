export const formatPercent = (v: number | null | undefined, digits = 2) => {
if (v === null || v === undefined || Number.isNaN(v)) return '-'
return `${v.toFixed(digits)}%`
}


export const parseDate = (s: string) => new Date(s)