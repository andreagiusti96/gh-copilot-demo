import { beforeEach, describe, expect, it } from 'vitest'
import { createCartStorage, CART_STORAGE_KEY } from './cartStorage'
import type { CartItem } from '../types/album'

function makeMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() { return map.size },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => { map.delete(k) },
    setItem: (k: string, v: string) => { map.set(k, v) }
  }
}

const sample: CartItem = {
  id: 1, title: 'T', artist: 'A', price: 9.99, image_url: 'x', year: 2020
}

describe('cartStorage', () => {
  let backend: Storage
  beforeEach(() => { backend = makeMemoryStorage() })

  it('load returns [] when nothing stored', () => {
    const s = createCartStorage(backend)
    expect(s.load()).toEqual([])
  })

  it('save then load round-trips items', () => {
    const s = createCartStorage(backend)
    s.save([sample])
    expect(s.load()).toEqual([sample])
  })

  it('uses the configured key', () => {
    const s = createCartStorage(backend, 'custom-key')
    s.save([sample])
    expect(backend.getItem('custom-key')).not.toBeNull()
  })

  it('load returns [] for invalid JSON', () => {
    backend.setItem(CART_STORAGE_KEY, '{not json')
    const s = createCartStorage(backend)
    expect(s.load()).toEqual([])
  })

  it('load filters out malformed entries', () => {
    backend.setItem(CART_STORAGE_KEY, JSON.stringify([sample, { id: 'bad' }, null]))
    const s = createCartStorage(backend)
    expect(s.load()).toEqual([sample])
  })

  it('load returns [] when stored value is not an array', () => {
    backend.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [] }))
    const s = createCartStorage(backend)
    expect(s.load()).toEqual([])
  })

  it('is a no-op when backend is null', () => {
    const s = createCartStorage(null)
    s.save([sample])
    expect(s.load()).toEqual([])
  })
})
