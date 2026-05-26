import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createCart } from './cart'
import type { Album } from '../types/album'
import type { CartStorage } from '../utils/cartStorage'

const albumA: Album = { id: 1, title: 'A', artist: 'X', price: 10, image_url: 'a.png', year: 2020 }
const albumB: Album = { id: 2, title: 'B', artist: 'Y', price: 12, image_url: 'b.png', year: 2021 }

function memoryStorage(initial: Album[] = []): { storage: CartStorage; saved: () => Album[] } {
  let data: Album[] = initial.slice()
  return {
    storage: {
      load: () => data.slice(),
      save: vi.fn((items: Album[]) => { data = items.slice() })
    },
    saved: () => data
  }
}

describe('createCart', () => {
  let mem: ReturnType<typeof memoryStorage>
  beforeEach(() => { mem = memoryStorage() })

  it('starts empty when storage is empty', () => {
    const cart = createCart(mem.storage)
    expect(cart.count.value).toBe(0)
    expect(cart.items.value).toEqual([])
  })

  it('hydrates from storage', () => {
    const seeded = memoryStorage([albumA])
    const cart = createCart(seeded.storage)
    expect(cart.count.value).toBe(1)
    expect(cart.has(albumA.id)).toBe(true)
  })

  it('add appends an album and increments count', () => {
    const cart = createCart(mem.storage)
    cart.add(albumA)
    expect(cart.count.value).toBe(1)
    expect(cart.items.value[0]).toMatchObject({ id: 1 })
  })

  it('add is idempotent (no duplicates)', () => {
    const cart = createCart(mem.storage)
    cart.add(albumA)
    cart.add(albumA)
    expect(cart.count.value).toBe(1)
  })

  it('remove deletes the matching album', () => {
    const cart = createCart(mem.storage)
    cart.add(albumA)
    cart.add(albumB)
    cart.remove(albumA.id)
    expect(cart.count.value).toBe(1)
    expect(cart.has(albumA.id)).toBe(false)
    expect(cart.has(albumB.id)).toBe(true)
  })

  it('remove is a no-op for missing id', () => {
    const cart = createCart(mem.storage)
    cart.add(albumA)
    cart.remove(999)
    expect(cart.count.value).toBe(1)
  })

  it('clear empties the cart', () => {
    const cart = createCart(mem.storage)
    cart.add(albumA)
    cart.add(albumB)
    cart.clear()
    expect(cart.count.value).toBe(0)
  })

  it('persists changes to storage', async () => {
    const cart = createCart(mem.storage)
    cart.add(albumA)
    await nextTick()
    expect(mem.storage.save).toHaveBeenCalled()
    expect(mem.saved()).toEqual([expect.objectContaining({ id: 1 })])
  })
})
