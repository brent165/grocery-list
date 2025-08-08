import type { GroceryItem, Filter } from '../types'

interface GroceryItemProps {
  item: GroceryItem
  filter: Filter
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function GroceryItemComponent({
  item,
  filter,
  onToggle,
  onDelete,
  
}: GroceryItemProps) {

  return (
    <li
      className={
        'group flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm transition-all duration-200 hover:shadow-md'
      }
    >

      <button
        type="button"
        onClick={() => {
          onToggle(item.id)
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          onToggle(item.id)
        }}
        role="checkbox"
        aria-checked={item.purchased}
        aria-label={item.purchased ? 'Mark as not purchased' : 'Mark as purchased'}
        className={
          'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition cursor-pointer ' +
          (item.purchased
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-zinc-300 bg-white text-transparent')
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3-3a1 1 0 111.42-1.42l2.29 2.29 6.54-6.54a1 1 0 011.42 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
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
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete "${item.name}"?`)) {
                onDelete(item.id)
              }
            }}
            aria-label="Delete item"
            title="Delete"
            className="relative z-10 rounded-lg p-2 text-rose-600 hover:text-rose-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </>
      </div>
    </li>
  )
}

