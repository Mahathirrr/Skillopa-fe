import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-dark-muted bg-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Skillopa</h3>
          <p className="text-sm text-white/70">
            Learn new skills online with expert-led courses. Build your career at your own pace.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Explore</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/courses" className="hover:text-white">All courses</Link></li>
            <li><Link to="/courses?level=beginner" className="hover:text-white">Beginner</Link></li>
            <li><Link to="/courses?level=intermediate" className="hover:text-white">Intermediate</Link></li>
            <li><Link to="/courses?level=advanced" className="hover:text-white">Advanced</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Account</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/login" className="hover:text-white">Log in</Link></li>
            <li><Link to="/register" className="hover:text-white">Sign up</Link></li>
            <li><Link to="/my-learning" className="hover:text-white">My learning</Link></li>
            <li><Link to="/certificates" className="hover:text-white">Certificates</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Teach</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/register" className="hover:text-white">Become an instructor</Link></li>
            <li><Link to="/instructor/dashboard" className="hover:text-white">Instructor dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-dark-muted py-4 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} Skillopa. All rights reserved.
      </div>
    </footer>
  )
}
