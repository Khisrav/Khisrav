<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { WindowId } from '@/composables/useDesktop'

export type DeskIcon = {
  id: WindowId
  label: string
  accent: string
  glyph: string
}

const props = defineProps<{
  icons: DeskIcon[]
}>()

const emit = defineEmits<{
  open: [id: WindowId]
}>()

type Pos = { x: number; y: number }

const positions = reactive<Record<string, Pos>>({})
const draggingId = ref<WindowId | null>(null)
const moved = ref(false)
const origin = ref({ mx: 0, my: 0, x: 0, y: 0 })

function defaultPositions() {
  const right = typeof window !== 'undefined' ? Math.max(12, window.innerWidth - 96) : 24
  let y = 96
  for (const icon of props.icons) {
    positions[icon.id] = { x: right, y }
    y += 88
  }
}

onMounted(() => {
  defaultPositions()
  window.addEventListener('resize', () => {
    for (const icon of props.icons) {
      const p = positions[icon.id]
      if (!p) continue
      p.x = Math.min(p.x, window.innerWidth - 84)
      p.y = Math.min(p.y, window.innerHeight - 100)
      p.x = Math.max(8, p.x)
      p.y = Math.max(64, p.y)
    }
  })
})

function onPointerDown(id: WindowId, e: PointerEvent) {
  const p = positions[id]
  if (!p) return
  draggingId.value = id
  moved.value = false
  origin.value = { mx: e.clientX, my: e.clientY, x: p.x, y: p.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(id: WindowId, e: PointerEvent) {
  if (draggingId.value !== id) return
  const dx = e.clientX - origin.value.mx
  const dy = e.clientY - origin.value.my
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.value = true
  const p = positions[id]
  if (!p) return
  p.x = Math.min(Math.max(8, origin.value.x + dx), window.innerWidth - 84)
  p.y = Math.min(Math.max(64, origin.value.y + dy), window.innerHeight - 100)
}

function onPointerUp(id: WindowId, e: PointerEvent) {
  if (draggingId.value !== id) return
  draggingId.value = null
  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {
    /* ok */
  }
}

function onDblClick(id: WindowId) {
  if (moved.value) return
  emit('open', id)
}

function onClick(id: WindowId) {
  // touch: single tap opens if we didn't drag
  if (moved.value) return
  if (window.matchMedia('(pointer: coarse)').matches) {
    emit('open', id)
  }
}
</script>

<template>
  <nav class="pointer-events-none absolute inset-0 z-30" aria-label="Desktop folders">
    <button
      v-for="icon in icons"
      :key="icon.id"
      type="button"
      class="pointer-events-auto absolute flex w-[76px] cursor-grab select-none flex-col items-center gap-1.5 rounded-xl p-1.5 text-center outline-none transition-colors duration-150 hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-white/25 active:cursor-grabbing"
      :class="{ 'z-40': draggingId === icon.id }"
      :style="{
        left: `${positions[icon.id]?.x ?? 0}px`,
        top: `${positions[icon.id]?.y ?? 0}px`,
      }"
      @pointerdown="onPointerDown(icon.id, $event)"
      @pointermove="onPointerMove(icon.id, $event)"
      @pointerup="onPointerUp(icon.id, $event)"
      @pointercancel="onPointerUp(icon.id, $event)"
      @dblclick.prevent="onDblClick(icon.id)"
      @click="onClick(icon.id)"
      @keydown.enter.prevent="emit('open', icon.id)"
      @keydown.space.prevent="emit('open', icon.id)"
    >
      <span class="folder relative grid size-12 place-items-center" :style="{ '--accent': icon.accent }">
        <span class="folder-tab" />
        <span class="folder-body">
          <span class="text-sm font-medium text-surface/70">{{ icon.glyph }}</span>
        </span>
      </span>
      <span
        class="max-w-full truncate rounded px-1 py-0.5 text-[12px] font-medium tracking-tight text-ink/90"
      >
        {{ icon.label }}
      </span>
    </button>
  </nav>
</template>

<style scoped>
.folder-tab {
  position: absolute;
  top: 6px;
  left: 9px;
  width: 18px;
  height: 8px;
  border-radius: 4px 6px 0 0;
  background: color-mix(in oklab, var(--accent) 75%, white 10%);
}

.folder-body {
  position: absolute;
  inset: 12px 5px 5px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: color-mix(in oklab, var(--accent) 78%, #3a3348);
  border: 1px solid color-mix(in oklab, white 16%, transparent);
  box-shadow: 0 4px 10px color-mix(in oklab, black 22%, transparent);
}
</style>
