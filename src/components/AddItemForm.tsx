import { useState } from 'react'
import type { ItemType } from '../types'
import { ITEM_TYPES } from '../types'

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, category: ItemType) => void
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number>(1)
  const [category, setCategory] = useState<ItemType>('Produce')

  function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return

    onAdd(trimmed, Math.max(1, Math.min(99, quantity || 1)), category)
    setName('')
    setQuantity(1)
    setCategory('Produce')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <section aria-label="add item" className="mb-5 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an item..."
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-base outline-none ring-emerald-500/30 placeholder:text-zinc-400 focus:ring-4"
        />
        <div className="flex items-stretch gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemType)}
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-base outline-none ring-emerald-500/30 focus:ring-4 sm:flex-none sm:w-48"
          >
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-center text-base outline-none ring-emerald-500/30 focus:ring-4 sm:w-24"
          />
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800 flex-[1.2] sm:flex-none"
          >
            Add
          </button>
        </div>
      </div>
    </section>
  )
}
