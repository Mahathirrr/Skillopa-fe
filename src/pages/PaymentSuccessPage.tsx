import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded border border-border bg-surface p-10 shadow-sm">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
        <h1 className="mb-2 text-2xl font-bold">Payment successful</h1>
        <p className="mb-8 text-muted">
          Your enrollment is confirmed. You can now access your courses in My Learning.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/my-learning"
            className="rounded bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark"
          >
            Go to My Learning
          </Link>
          <Link
            to="/courses"
            className="rounded border border-dark px-6 py-3 text-sm font-bold hover:bg-bg"
          >
            Browse more courses
          </Link>
        </div>
      </div>
    </div>
  )
}
