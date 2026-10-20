import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CourseCard } from '@/components/CourseCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api, type CourseListParams } from '@/lib/api'

const SORT_OPTIONS = [
  { value: '', labelKey: 'catalog.sortNewest' },
  { value: 'popular', labelKey: 'catalog.sortPopular' },
  { value: 'rating', labelKey: 'catalog.sortRating' },
  { value: 'price_asc', labelKey: 'catalog.sortPriceAsc' },
  { value: 'price_desc', labelKey: 'catalog.sortPriceDesc' },
] as const

export function CatalogPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoryId = params.get('category_id') ?? ''
  const level = params.get('level') ?? ''
  const minPrice = params.get('min_price') ?? ''
  const maxPrice = params.get('max_price') ?? ''
  const minRating = params.get('min_rating') ?? ''
  const maxDuration = params.get('max_duration') ?? ''
  const sort = params.get('sort') ?? ''

  const [searchInput, setSearchInput] = useState(q)

  useEffect(() => {
    setSearchInput(q)
  }, [q])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput.trim() === q.trim()) return
      const next = new URLSearchParams(params)
      const trimmed = searchInput.trim()
      if (trimmed) next.set('q', trimmed)
      else next.delete('q')
      setParams(next)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchInput, q, params, setParams])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.listCategories(),
  })

  const filterParams: CourseListParams = {
    q: q.trim() || undefined,
    category_id: categoryId ? Number(categoryId) : undefined,
    level: level || undefined,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    min_rating: minRating ? Number(minRating) : undefined,
    max_duration: maxDuration ? Number(maxDuration) : undefined,
    sort: (sort as CourseListParams['sort']) || undefined,
    limit: 24,
  }

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['courses', filterParams],
    queryFn: async () => {
      const trimmed = filterParams.q?.trim()
      if (
        trimmed &&
        !filterParams.category_id &&
        !filterParams.level &&
        filterParams.min_price == null &&
        filterParams.max_price == null &&
        filterParams.min_rating == null &&
        filterParams.max_duration == null &&
        !filterParams.sort
      ) {
        const res = await api.searchCourses(trimmed, filterParams.limit, filterParams.offset ?? 0)
        return { courses: res.courses }
      }
      return api.listCourses(filterParams)
    },
    placeholderData: keepPreviousData,
  })

  const courses = data?.courses ?? []
  const categories = categoriesData?.categories ?? []

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">{t('catalog.title')}</h1>
        <p className="mt-1 text-muted">{t('catalog.subtitle')}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            className="w-full rounded border border-border bg-surface py-2.5 pl-10 pr-4 outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryId}
            onChange={(e) => updateParam('category_id', e.target.value)}
            className="rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">{t('catalog.allCategories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => updateParam('level', e.target.value)}
            className="rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          >
            <option value="">{t('catalog.allLevels')}</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="number"
            min="0"
            placeholder={t('catalog.minPrice')}
            value={minPrice}
            onChange={(e) => updateParam('min_price', e.target.value)}
            className="w-28 rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          />
          <input
            type="number"
            min="0"
            placeholder={t('catalog.maxPrice')}
            value={maxPrice}
            onChange={(e) => updateParam('max_price', e.target.value)}
            className="w-28 rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          />
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder={t('catalog.minRating')}
            value={minRating}
            onChange={(e) => updateParam('min_rating', e.target.value)}
            className="w-28 rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          />
          <input
            type="number"
            min="0"
            placeholder={t('catalog.maxDuration')}
            value={maxDuration}
            onChange={(e) => updateParam('max_duration', e.target.value)}
            className="w-36 rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          />
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value || 'default'} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <p className="text-lg font-semibold text-dark">{t('common.error')}</p>
          <button type="button" onClick={() => refetch()} className="mt-4 text-primary hover:underline">
            {t('common.retry')}
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <p className="text-lg font-semibold text-dark">{t('catalog.noResults')}</p>
          <p className="mt-1 text-muted">{t('catalog.adjustFilters')}</p>
        </div>
      ) : (
        <>
          {isFetching && <p className="mb-3 text-sm text-muted">{t('catalog.updating')}</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
