export type ItemType =
  | 'Produce'
  | 'Meat'
  | 'Dairy'
  | 'Bakery'
  | 'Frozen'
  | 'Pantry'
  | 'Beverages'
  | 'Household'
  | 'Personal Care'
  | 'Other'

export const ITEM_TYPES: ItemType[] = [
  // Requested explicit order
  'Personal Care',
  'Produce',
  'Meat',
  'Dairy',
  'Bakery',
  'Frozen',
  'Pantry',
  'Beverages',
  // Remaining categories at the end
  'Household',
  'Other',
]

export type GroceryItem = {
  id: string
  name: string
  quantity: number
  purchased: boolean
  createdAt: number
  category: ItemType
}

export type GroceryList = {
  id: string
  name: string
  items: GroceryItem[]
  createdAt: number
  groupNotes?: Partial<Record<ItemType, string>>
}

export type Filter = 'all' | 'active' | 'purchased'
