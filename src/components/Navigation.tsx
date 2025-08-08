import { useState } from 'react'
import type { GroceryList } from '../types'

interface NavigationProps {
  lists: GroceryList[]
  currentListId: string
  currentList: GroceryList | undefined
  stats: { total: number; done: number; remaining: number }
  onListChange: (listId: string) => void
  onShowListManager: () => void
}

export function Navigation({
  lists,
  currentListId,
  currentList,
  stats,
  onListChange,
  onShowListManager,
}: NavigationProps) {
  const [showNavDropdown, setShowNavDropdown] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-screen-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">Grocery</span>{' '}
              Lists
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* List Selector */}
            <div className="relative">
              <button
                onClick={() => setShowNavDropdown(!showNavDropdown)}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
              >
                <span className="truncate max-w-32">
                  {currentList?.name || 'Select List'}
                </span>
                <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showNavDropdown && (
                <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {lists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => {
                          onListChange(list.id)
                          setShowNavDropdown(false)
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          currentListId === list.id
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'hover:bg-zinc-50'
                        }`}
                      >
                        <div className="font-medium">{list.name}</div>
                        <div className="text-xs text-zinc-500">{list.items.length} items</div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 border-t border-zinc-200 pt-2">
                    <button
                      onClick={() => {
                        onShowListManager()
                        setShowNavDropdown(false)
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                    >
                      + Create New List
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Manage Lists Button */}
            <button
              onClick={onShowListManager}
              className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showNavDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNavDropdown(false)}
        />
      )}
    </nav>
  )
}
