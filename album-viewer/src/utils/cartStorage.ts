import type { CartItem } from '../types/album'

export const CART_STORAGE_KEY = 'album-viewer.cart.v1'

export interface CartStorage {
  load(): CartItem[]
  save(items: CartItem[]): void
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.artist === 'string' &&
    typeof v.price === 'number' &&
    typeof v.image_url === 'string'
  )
}

export function createCartStorage(
  backend: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null,
  key: string = CART_STORAGE_KEY
): CartStorage {
  return {
    load(): CartItem[] {
      if (!backend) return []
      try {
        const raw = backend.getItem(key)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []
        return parsed.filter(isCartItem)
      } catch {
        return []
      }
    },
    save(items: CartItem[]): void {
      if (!backend) return
      try {
        backend.setItem(key, JSON.stringify(items))
      } catch {
        // ignore quota/serialization errors
      }
    }
  }
}
