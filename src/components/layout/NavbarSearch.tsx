import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  initialQuery?: string
  onSubmit: (query: string) => void
  className?: string
}

export function NavbarSearch({ initialQuery = '', onSubmit, className }: Props) {
  const { t } = useTranslation()
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('nav.searchPlaceholder')}
          className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </form>
  )
}
