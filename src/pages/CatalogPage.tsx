import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { CourseCard } from '@/components/CourseCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoryId = params.get('category_id') ?? ''
  const level = params.get('level') ?? ''

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.listCategories(),
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['courses', q, categoryId, level],
    queryFn: async () => {
      if (q.trim()) {
        return api.searchCourses(q.trim())
      }
      return api.listCourses({
        category_id: categoryId ? Number(categoryId) : undefined,
        level: level || undefined,
        limit: 24,
      })
    },
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
        <h1 className="text-3xl font-bold text-dark">Course catalog</h1>
        <p className="mt-1 text-muted">Discover courses to boost your skills</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => updateParam('q', e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded border border-border bg-surface py-2.5 pl-10 pr-4 outline-none focus:border-primary"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => updateParam('category_id', e.target.value)}
          className="rounded border border-border bg-surface px-3 py-2.5 outline-none focus:border-primary"
        >
          <option value="">All categories</option>
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
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : courses.length === 0 ? (
        <div className="rounded border border-border bg-surface py-16 text-center">
          <p className="text-lg font-semibold text-dark">No courses found</p>
          <p className="mt-1 text-muted">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
