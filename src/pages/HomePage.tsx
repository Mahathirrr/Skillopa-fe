import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CourseCard } from '@/components/CourseCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { api } from '@/lib/api'
import heroImage from '@/assets/hero.png'

export function HomePage() {
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: () => api.listCourses({ limit: 8 }),
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.listCategories(),
  })

  const courses = coursesData?.courses ?? []
  const categories = categoriesData?.categories ?? []

  return (
    <div>
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-2 lg:px-6 lg:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              New courses added weekly
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight lg:text-5xl">
              Learn skills that move your career forward
            </h1>
            <p className="mb-8 max-w-lg text-lg text-white/75">
              Join thousands of learners mastering in-demand skills with expert instructors and hands-on projects.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 text-sm font-bold hover:bg-primary-dark"
              >
                Explore courses
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded border border-white/30 px-6 py-3 text-sm font-bold hover:bg-white/10"
              >
                Start for free
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <img
              src={heroImage}
              alt="Students learning online"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark">Featured courses</h2>
            <p className="mt-1 text-muted">Popular picks from our catalog</p>
          </div>
          <Link to="/courses" className="text-sm font-bold text-primary hover:underline">
            View all
          </Link>
        </div>
        {coursesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="mb-2 text-2xl font-bold text-dark">Browse by category</h2>
          <p className="mb-8 text-muted">Find the right course for your goals</p>
          {categoriesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/courses?category_id=${cat.id}`}
                  className="rounded border border-border bg-bg px-5 py-4 font-semibold text-dark transition hover:border-primary hover:bg-white hover:shadow-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary-dark p-8 text-white lg:p-12">
          <h2 className="mb-3 text-2xl font-bold lg:text-3xl">Become an instructor</h2>
          <p className="mb-6 max-w-xl text-white/80">
            Share your expertise with learners worldwide. Create courses, build your audience, and earn on your schedule.
          </p>
          <Link
            to="/register"
            className="inline-block rounded bg-white px-6 py-3 text-sm font-bold text-primary hover:bg-accent"
          >
            Get started today
          </Link>
        </div>
      </section>
    </div>
  )
}
