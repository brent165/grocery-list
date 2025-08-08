import { useState } from 'react'
import type { GroceryItem, Filter } from '../types'

interface GroceryItemProps {
  item: GroceryItem
  filter: Filter
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (item: GroceryItem) => void
  onSaveEdit: (id: string, name: string, quantity: number) => void
  editingId: string | null
  draggedItemId: string | null
  dragOverItemId: string | null
  onDragStart: (e: React.DragEvent<HTMLElement>, itemId: string) => void
  onDragOver: (e: React.DragEvent<HTMLLIElement>, itemId: string) => void
  onDragLeave: (e: React.DragEvent<HTMLLIElement>) => void
  onDrop: (e: React.DragEvent<HTMLLIElement>, itemId: string) => void
  onDragEnd: () => void
}

export function GroceryItemComponent({
  item,
  filter,
  onToggle,
  onDelete,
  onEdit,
  onSaveEdit,
  editingId,
  draggedItemId,
  dragOverItemId,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: GroceryItemProps) {
  const [editName, setEditName] = useState(item.name)
  const [editQuantity, setEditQuantity] = useState(item.quantity)

  const isEditing = editingId === item.id

  function handleSaveEdit(e?: React.MouseEvent) {
    if (e) {
      e.stopPropagation()
    }
    const trimmed = editName.trim()
    if (!trimmed) {
      onDelete(item.id)
      return
    }
    onSaveEdit(item.id, trimmed, Math.max(1, Math.min(99, editQuantity || 1)))
  }

  function handleStartEdit(e?: React.MouseEvent) {
    if (e) {
      e.stopPropagation()
    }
    onEdit(item)
    setEditName(item.name)
    setEditQuantity(item.quantity)
  }

  function preventDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <li
      onDragOver={(e) => onDragOver(e, item.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, item.id)}
      className={`group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 ${
        draggedItemId === item.id
          ? 'opacity-50 scale-95 rotate-1'
          : dragOverItemId === item.id
          ? 'border-emerald-300 bg-emerald-50 scale-105'
          : 'hover:shadow-md'
      }`}
    >
      {/* Drag Handle */}
      <div
        className="flex shrink-0 select-none cursor-grab items-center text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, item.id)}
        onDragEnd={onDragEnd}
        aria-label="Drag to reorder"
        role="button"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
        </svg>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(item.id)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={preventDrag}
        draggable={false}
        aria-label={item.purchased ? 'Mark as not purchased' : 'Mark as purchased'}
        className={
          'relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition ' +
          (item.purchased
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-zinc-300 bg-white text-transparent')
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3-3a1 1 0 111.42-1.42l2.29 2.29 6.54-6.54a1 1 0 011.42 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 outline-none ring-emerald-500/30 focus:ring-4"
            />
            <input
              type="number"
              min={1}
              max={99}
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
              className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-center outline-none ring-emerald-500/30 focus:ring-4"
            />
          </div>
        ) : (
          <div className={`min-w-0`}>
            <div className="flex flex-wrap items-center gap-2">
              <p
                className={
                  'truncate text-base font-semibold ' +
                  (item.purchased && filter !== 'purchased' ? 'text-zinc-400 line-through' : 'text-zinc-900')
                }
              >
                {item.name}
              </p>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                ×{item.quantity}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSaveEdit}
              onMouseDown={(e) => e.stopPropagation()}
              onDragStart={preventDrag}
              draggable={false}
              className="relative z-10 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit({ ...item, id: '' })
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onDragStart={preventDrag}
              draggable={false}
              className="relative z-10 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleStartEdit}
              onMouseDown={(e) => e.stopPropagation()}
              onDragStart={preventDrag}
              draggable={false}
              className="relative z-10 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${item.name}"?`)) {
                  onDelete(item.id)
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onDragStart={preventDrag}
              draggable={false}
              className="relative z-10 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}
