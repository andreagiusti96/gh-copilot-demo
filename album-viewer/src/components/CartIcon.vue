<template>
  <button
    type="button"
    class="cart-icon"
    :aria-label="`Open cart (${count} item${count === 1 ? '' : 's'})`"
    @click="$emit('open')"
  >
    <span class="cart-glyph" aria-hidden="true">🛒</span>
    <span v-if="count > 0" class="cart-badge" aria-hidden="true">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '../stores/cart'

defineEmits<{ (e: 'open'): void }>()

const cart = useCart()
const count = computed(() => cart.count.value)
</script>

<style scoped>
.cart-icon {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.2s ease;
}

.cart-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff3b30;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
