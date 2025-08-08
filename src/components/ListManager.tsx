import { useState } from 'react'
import type { GroceryList } from '../types'

interface ListManagerProps {
  lists: GroceryList[]
  onClose: () => void
  onCreateList: (name: string) => void
  onRenameList: (listId: string, newName: string) => void
  onDeleteList: (listId: string) => void
}

export function ListManager({
  lists,
  onClose,
  onCreateList,
  onRenameList,
  onDeleteList,
}: ListManagerProps) {
  const [newListName, setNewListName] = useState('')

  function handleCreateList() {
    const trimmed = newListName.trim()
    if (!trimmed) return

    onCreateList(trimmed)
    setNewListName('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCreateList()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Manage Lists</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:text-zinc-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4 space-y-2">
          {lists.map((list) => (
            <div key={list.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex-1">
                <div className="font-medium">{list.name}</div>
                <div className="text-sm text-zinc-500">{list.items.length} items</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newName = prompt('Enter new name:', list.name)
                    if (newName) onRenameList(list.id, newName)
                  }}
                  className="rounded px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-200"
                >
                  Rename
                </button>
                {lists.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${list.name}"?`)) onDeleteList(list.id)
                    }}
                    className="rounded px-2 py-1 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New list name..."
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 outline-none ring-emerald-500/30 focus:ring-4"
          />
          <button
            onClick={handleCreateList}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
