import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f5f7' }}>
      <nav
        className="sticky top-0 z-30 border-b"
        style={{
          background: '#0d1117',
          borderColor: 'rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Left: brand + nav */}
            <div className="flex items-center gap-7">
              <Link to="/" className="flex items-center gap-2.5 shrink-0">
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#4f46e5' }}
                >
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </div>
                <span className="text-white font-semibold text-[15px] tracking-tight">
                  Deployed
                </span>
              </Link>

              <div className="hidden sm:flex items-center gap-0.5">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/6'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/applications"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/6'
                    }`
                  }
                >
                  Applications
                </NavLink>
              </div>
            </div>

            {/* Right: user + sign out */}
            <div className="flex items-center gap-5">
              <span className="hidden sm:block text-[13px] text-slate-500 truncate max-w-[180px]">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-150"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
