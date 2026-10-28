import { useTranslation } from 'react-i18next'

type Demo = { label: string; email: string; password: string }

const DEMOS: Demo[] = [
  { label: 'demoStudent', email: 'ahmad.rizki@student.usk.ac.id', password: 'student123' },
  { label: 'demoInstructor', email: 'muhammad.mahathir.id@gmail.com', password: 'instructor123' },
  { label: 'demoAdmin', email: 'admin@showcaseproject.my.id', password: 'admin123' },
]

type Props = {
  onPick: (email: string, password: string) => void
}

export function DemoAccountPanel({ onPick }: Props) {
  const { t } = useTranslation()

  return (
    <div className="mt-6 rounded-lg border border-dashed border-border bg-bg/80 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t('auth.demoAccounts')}</p>
      <div className="flex flex-wrap gap-2">
        {DEMOS.map((d) => (
          <button
            key={d.email}
            type="button"
            onClick={() => onPick(d.email, d.password)}
            className="cursor-pointer rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:border-primary hover:text-primary"
          >
            {t(`auth.${d.label}`)}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted">{t('auth.demoHint')}</p>
    </div>
  )
}
