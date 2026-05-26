import { computed, reactive, watch, type ComputedRef } from 'vue'
import type { Album, CartItem } from '../types/album'
import { createCartStorage, type CartStorage } from '../utils/cartStorage'

export interface CartApi {
  readonly items: ComputedRef<readonly CartItem[]>
  readonly count: ComputedRef<number>
  has(id: number): boolean
  add(album: Album): void
  remove(id: number): void
  clear(): void
}

export function createCart(storage: CartStorage = createCartStorage()): CartApi {
  const state = reactive<{ items: CartItem[] }>({
    items: storage.load()
  })

  watch(
    () => state.items,
    (items) => storage.save(items.slice()),
    { deep: true }
  )

  const items = computed<readonly CartItem[]>(() => state.items)
  const count = computed(() => state.items.length)

  function has(id: number): boolean {
    return state.items.some((item) => item.id === id)
  }

  function add(album: Album): void {
    if (has(album.id)) return
    state.items.push({ ...album })
  }

  function remove(id: number): void {
    const idx = state.items.findIndex((item) => item.id === id)
    if (idx >= 0) state.items.splice(idx, 1)
  }

  function clear(): void {
    state.items.splice(0, state.items.length)
  }

  return { items, count, has, add, remove, clear }
}

let singleton: CartApi | null = null

export function useCart(): CartApi {
  if (!singleton) singleton = createCart()
  return singleton
}

// Test-only helper
export function __resetCartSingleton(): void {
  singleton = null
}
