'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/recipes', label: 'Recipes', icon: '🍽️' },
    { href: '/admin/guides', label: 'Guides', icon: '📚' },
    { href: '/admin/ingredients', label: 'Ingredients', icon: '🥬' },
  ]

  return (
    <nav className="bg-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold">
              🌿 Happy Foraging Admin
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-primary hover:text-white'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-white text-sm"
              target="_blank"
            >
              View Site →
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
