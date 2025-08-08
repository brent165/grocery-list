import { useMemo, useState, useEffect } from 'react'
import { GroceryItemComponent } from './components/GroceryItem'
import { AddItemForm } from './components/AddItemForm'
import { Navigation } from './components/Navigation'
import { ListManager } from './components/ListManager'
import { useLocalStorageState } from './hooks/useLocalStorage'
import type { GroceryItem, GroceryList, Filter, ItemType } from './types'
import { ITEM_TYPES } from './types'

const STORAGE_KEY = 'grocery-lists-v1'

function App() {
  const [lists, setLists] = useLocalStorageState<GroceryList[]>(STORAGE_KEY, () => [
    {
      id: 'default',
      name: 'My Grocery List',
      items: [],
      createdAt: Date.now(),
      groupNotes: {},
    },
  ])
  const [currentListId, setCurrentListId] = useState<string>('default')
  const [filter, setFilter] = useState<Filter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showListManager, setShowListManager] = useState(false)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Record<ItemType, boolean>>({} as Record<ItemType, boolean>)

  // Migration: ensure all items in all lists have a category and remove notes if present; ensure groupNotes exists
  useEffect(() => {
    let changed = false
    const migrated = lists.map((l) => {
      const newItems = l.items.map((it: any) => {
        const withCategory = it.category ? it : { ...it, category: 'Other' as ItemType }
        if ('notes' in withCategory) {
          const { notes, ...rest } = withCategory
          changed = true
          return rest
        }
        if (withCategory !== it) changed = true
        return withCategory
      })
      const withGroupNotes = l.groupNotes ? l.groupNotes : {}
      if (!l.groupNotes) changed = true
      return newItems === l.items && withGroupNotes === l.groupNotes
        ? l
        : { ...l, items: newItems, groupNotes: withGroupNotes }
    })
    if (changed) setLists(migrated)
  }, [lists, setLists])

  const currentList = useMemo(() => lists.find((l) => l.id === currentListId) || lists[0], [lists, currentListId])
  const items = currentList?.items || []
  const groupNotes = currentList?.groupNotes || {}

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'active':
        return items.filter((i) => !i.purchased)
      case 'purchased':
        return items.filter((i) => i.purchased)
      default:
        return items
    }
  }, [items, filter])

  const grouped = useMemo(() => {
    const map = new Map<ItemType, GroceryItem[]>()
    for (const type of ITEM_TYPES) map.set(type, [])
    for (const it of filteredItems) {
      const key = it.category ?? ('Other' as ItemType)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(it)
    }
    return Array.from(map.entries()) as [ItemType, GroceryItem[]][]
  }, [filteredItems])

  const stats = useMemo(() => {
    const total = items.length
    const done = items.filter((i) => i.purchased).length
    return { total, done, remaining: total - done }
  }, [items])

  function updateCurrentList(updater: (list: GroceryList) => GroceryList) {
    setLists((prev) =>
      prev.map((list) => (list.id === currentListId ? updater(list) : list))
    )
  }

  function handleAdd(name: string, quantity: number, category: ItemType) {
    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name,
      quantity,
      purchased: false,
      createdAt: Date.now(),
      category,
    }
    updateCurrentList((list) => ({
      ...list,
      items: [newItem, ...list.items],
    }))
  }

  function handleToggle(id: string) {
    updateCurrentList((list) => ({
      ...list,
      items: list.items.map((it) => (it.id === id ? { ...it, purchased: !it.purchased } : it)),
    }))
  }

  function handleDelete(id: string) {
    updateCurrentList((list) => ({
      ...list,
      items: list.items.filter((it) => it.id !== id),
    }))
  }

  function handleEdit(item: GroceryItem) {
    setEditingId(item.id)
  }

  function handleSaveEdit(id: string, name: string, quantity: number) {
    updateCurrentList((list) => ({
      ...list,
      items: list.items.map((it) =>
        it.id === id
          ? {
              ...it,
              name,
              quantity,
            }
          : it,
      ),
    }))
    setEditingId(null)
  }

  function toggleGroupExpand(category: ItemType) {
    setExpandedGroups((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  function saveGroupNote(category: ItemType, note: string) {
    updateCurrentList((list) => ({
      ...list,
      groupNotes: { ...(list.groupNotes || {}), [category]: note },
    }))
  }

  // Drag and Drop functions
  function handleDragStart(e: React.DragEvent<HTMLElement>, itemId: string) {
    setDraggedItemId(itemId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', itemId)
  }

  function handleDragOver(e: React.DragEvent<HTMLElement>, itemId: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedItemId && draggedItemId !== itemId) {
      setDragOverItemId(itemId)
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLElement>) {
    e.preventDefault()
    setDragOverItemId(null)
  }

  function handleDrop(e: React.DragEvent<HTMLElement>, dropItemId: string) {
    e.preventDefault()
    if (!draggedItemId || draggedItemId === dropItemId) {
      setDraggedItemId(null)
      setDragOverItemId(null)
      return
    }

    updateCurrentList((list) => {
      const draggedIndex = list.items.findIndex((item) => item.id === draggedItemId)
      const dropIndex = list.items.findIndex((item) => item.id === dropItemId)
      
      if (draggedIndex === -1 || dropIndex === -1) return list

      const newItems = [...list.items]
      const [draggedItem] = newItems.splice(draggedIndex, 1)
      newItems.splice(dropIndex, 0, draggedItem)

      return {
        ...list,
        items: newItems,
      }
    })

    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  function handleDragEnd() {
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  function createNewList(name: string) {
    const newList: GroceryList = {
      id: crypto.randomUUID(),
      name,
      items: [],
      createdAt: Date.now(),
      groupNotes: {},
    }
    setLists((prev) => [...prev, newList])
    setCurrentListId(newList.id)
    setShowListManager(false)
  }

  function deleteList(listId: string) {
    if (lists.length <= 1) return
    setLists((prev) => prev.filter((l) => l.id !== listId))
    if (currentListId === listId) {
      setCurrentListId(lists[0]?.id || 'default')
    }
  }

  function renameList(listId: string, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed) return
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, name: trimmed } : list))
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-[Inter,system-ui]">
      <Navigation
        lists={lists}
        currentListId={currentListId}
        currentList={currentList}
        onListChange={setCurrentListId}
        onShowListManager={() => setShowListManager(true)}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-screen-sm px-4 pb-24 pt-6">
        {/* Stats */}
        {items.length > 0 && (
          <div className="mb-4 text-center text-sm text-zinc-500">
            {stats.remaining} left • {stats.done} purchased
          </div>
        )}

        <AddItemForm onAdd={handleAdd} />

        <section className="mb-4 flex items-center justify-center">
          <div className="inline-flex rounded-xl bg-zinc-100 p-1 text-sm">
            {(['all', 'active', 'purchased'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={
                  'rounded-lg px-3 py-1.5 font-medium capitalize transition ' +
                  (filter === key ? 'bg-white shadow-sm' : 'text-zinc-600 hover:text-zinc-800')
                }
              >
                {key}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
          {grouped.map(([category, groupItems]) => (
            groupItems.length === 0 ? null : (
              <section key={category} className="rounded-2xl border border-zinc-200 bg-white/50 p-0">
                <header className="sticky top-0 z-10 -mx-px -mt-px flex items-center justify-between rounded-t-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-2 text-sm font-semibold text-zinc-700 backdrop-blur">
                  <span className="inline-flex items-center gap-2">
                    {category}
                    {groupNotes[category] && groupNotes[category]!.trim().length > 0 ? (
                      <span className="ml-1 h-2 w-2 rounded-full bg-amber-500" aria-label="Has notes" />
                    ) : null}
                  </span>
                  <button
                    className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
                    onClick={() => toggleGroupExpand(category)}
                  >
                    {expandedGroups[category] ? 'Hide Notes' : 'Show Notes'}
                  </button>
                </header>
                {expandedGroups[category] && (
                  <div className="px-4 pb-2">
                    <textarea
                      value={groupNotes[category] || ''}
                      onChange={(e) => saveGroupNote(category, e.target.value)}
                      placeholder={`Notes for ${category}...`}
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-emerald-500/30 placeholder:text-zinc-400 focus:ring-4"
                      rows={3}
                    />
                  </div>
                )}
                <ul className="divide-y divide-zinc-100 p-4">
                  {groupItems.map((item) => (
                    <GroceryItemComponent
                      key={item.id}
                      item={item}
                      filter={filter}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onSaveEdit={handleSaveEdit}
                      editingId={editingId}
                      draggedItemId={draggedItemId}
                      dragOverItemId={dragOverItemId}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </ul>
              </section>
            )
          ))}
        </div>
      </div>

      {/* List Manager Modal */}
      {showListManager && (
        <ListManager
          lists={lists}
          onClose={() => setShowListManager(false)}
          onCreateList={createNewList}
          onRenameList={renameList}
          onDeleteList={deleteList}
        />
      )}

      {/* Footer */}
      <footer className="fixed inset-x-0 bottom-0 mx-auto max-w-screen-sm border-t border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between text-sm">
          <div className="text-zinc-600">
            {stats.total} items • {stats.done} purchased
          </div>
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-zinc-800"
          >
            Built with Tailwind
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
