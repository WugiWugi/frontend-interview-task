import styles from './Controls.module.css'


type Props = {
    variants: string[]
    visible: Record<string, boolean>
    onToggle: (name: string) => void
    mode: 'day' | 'week'
    onModeChange: (m: 'day' | 'week') => void
}


export default function Controls({ variants, visible, onToggle, mode, onModeChange }: Props) {
    return (
        <div className={styles.controls}>
            {variants.map(v => (
                <label key={v} className={styles.variantCheckbox}>
                    <input
                        type="checkbox"
                        checked={!!visible[v]}
                        onChange={() => onToggle(v)}
                    />
                    <span>{v}</span>
                </label>
            ))}


            <div className={styles.switch}>
                <label>
                    <input
                        type="radio"
                        name="mode"
                        checked={mode === 'day'}
                        onChange={() => onModeChange('day')}
                    />
                    Day
                </label>
                <label style={{ marginLeft: 8 }}>
                    <input
                        type="radio"
                        name="mode"
                        checked={mode === 'week'}
                        onChange={() => onModeChange('week')}
                    />
                    Week
                </label>
            </div>


            <div style={{ marginLeft: 'auto' }}>
                <button onClick={() => window.dispatchEvent(new Event('resetZoom'))}>Reset zoom</button>
            </div>
        </div>
    )
}