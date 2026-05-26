<template>
  <Transition name="drawer">
    <div v-if="open" class="cart-overlay" @click.self="$emit('close')">
      <aside
        class="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        @keydown.esc="$emit('close')"
        tabindex="-1"
        ref="drawerRef"
      >
        <header class="cart-header">
          <h2>Your Cart ({{ cart.count.value }})</h2>
          <button class="close-btn" type="button" aria-label="Close cart" @click="$emit('close')">×</button>
        </header>

        <div v-if="cart.count.value === 0" class="cart-empty">
          <p>Your cart is empty — add some albums!</p>
        </div>

        <ul v-else class="cart-list">
          <li v-for="item in cart.items.value" :key="item.id" class="cart-item">
            <img :src="item.image_url" :alt="item.title" class="cart-thumb" />
            <div class="cart-meta">
              <p class="cart-title">{{ item.title }}</p>
              <p class="cart-artist">{{ item.artist }}</p>
              <p class="cart-price">${{ item.price.toFixed(2) }}</p>
            </div>
            <button
              type="button"
              class="cart-remove"
              :aria-label="`Remove ${item.title} from cart`"
              @click="cart.remove(item.id)"
            >
              Remove
            </button>
          </li>
        </ul>

        <footer v-if="cart.count.value > 0" class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <strong>${{ total.toFixed(2) }}</strong>
          </div>
          <button type="button" class="clear-btn" @click="cart.clear()">Clear cart</button>
        </footer>
      </aside>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useCart } from '../stores/cart'

const props = defineProps<{ open: boolean }>()
defineEmits<{ (e: 'close'): void }>()

const cart = useCart()
const drawerRef = ref<HTMLElement | null>(null)

const total = computed(() =>
  cart.items.value.reduce((sum, item) => sum + item.price, 0)
)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      drawerRef.value?.focus()
    }
  }
)
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.cart-drawer {
  width: min(420px, 100vw);
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.25);
  outline: none;
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 0 0.25rem;
}

.close-btn:hover { color: #000; }

.cart-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  padding: 2rem;
  text-align: center;
}

.cart-list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  overflow-y: auto;
  flex: 1;
}

.cart-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.cart-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.cart-meta {
  flex: 1;
  min-width: 0;
}

.cart-meta p {
  margin: 0;
  line-height: 1.3;
}

.cart-title {
  font-weight: 600;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-artist {
  font-size: 0.85rem;
  color: #666;
}

.cart-price {
  font-size: 0.95rem;
  color: #667eea;
  font-weight: 600;
  margin-top: 0.25rem !important;
}

.cart-remove {
  background: transparent;
  border: 1px solid #ff3b30;
  color: #ff3b30;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.cart-remove:hover {
  background: #ff3b30;
  color: white;
}

.cart-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  color: #333;
}

.clear-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  font-weight: 600;
}

.clear-btn:hover {
  background: #5a6fd8;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .cart-drawer {
    width: 100vw;
  }
}
</style>
