<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import type { WindowId, WindowState } from '@/composables/useDesktop'

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const props = defineProps<{
  win: WindowState
  closing?: boolean
  terminal?: boolean
}>()

const emit = defineEmits<{
  focus: [id: WindowId]
  close: [id: WindowId]
  minimize: [id: WindowId]
  maximize: [id: WindowId]
  move: [id: WindowId, x: number, y: number]
  resize: [id: WindowId, next: Partial<Pick<WindowState, 'x' | 'y' | 'w' | 'h'>>]
}>()

const dragging = ref(false)
const resizing = ref(false)
const resizeEdge = ref<ResizeEdge | null>(null)
const origin = ref({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 })

const edges: { edge: ResizeEdge; class: string }[] = [
  { edge: 'n', class: 'handle-n' },
  { edge: 's', class: 'handle-s' },
  { edge: 'e', class: 'handle-e' },
  { edge: 'w', class: 'handle-w' },
  { edge: 'ne', class: 'handle-ne' },
  { edge: 'nw', class: 'handle-nw' },
  { edge: 'se', class: 'handle-se' },
  { edge: 'sw', class: 'handle-sw' },
]

const style = computed(() => {
  if (props.win.maximized) {
    return {
      left: `${props.win.x}px`,
      top: `${props.win.y}px`,
      width: `${props.win.w}px`,
      height: `${props.win.h}px`,
      zIndex: props.win.z,
      maxWidth: 'none',
      maxHeight: 'none',
      borderRadius: '1rem',
    }
  }
  return {
    left: `${props.win.x}px`,
    top: `${props.win.y}px`,
    width: `${props.win.w}px`,
    height: `${props.win.h}px`,
    zIndex: props.win.z,
  }
})

function snapshot(e: PointerEvent) {
  origin.value = {
    mx: e.clientX,
    my: e.clientY,
    x: props.win.x,
    y: props.win.y,
    w: props.win.w,
    h: props.win.h,
  }
}

function onDragDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('[data-win-control]')) return
  emit('focus', props.win.id)
  dragging.value = true
  snapshot(e)
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onDragMove(e: PointerEvent) {
  if (!dragging.value) return
  const dx = e.clientX - origin.value.mx
  const dy = e.clientY - origin.value.my
  emit('move', props.win.id, origin.value.x + dx, origin.value.y + dy)
}

function onDragUp(e: PointerEvent) {
  dragging.value = false
  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {
    /* already released */
  }
}

function onResizeDown(edge: ResizeEdge, e: PointerEvent) {
  if (props.win.maximized) return
  e.preventDefault()
  e.stopPropagation()
  emit('focus', props.win.id)
  resizing.value = true
  resizeEdge.value = edge
  snapshot(e)
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onResizeMove(e: PointerEvent) {
  if (!resizing.value || !resizeEdge.value) return
  const edge = resizeEdge.value
  const dx = e.clientX - origin.value.mx
  const dy = e.clientY - origin.value.my
  const o = origin.value
  const next: Partial<Pick<WindowState, 'x' | 'y' | 'w' | 'h'>> = {}

  if (edge.includes('e')) next.w = o.w + dx
  if (edge.includes('s')) next.h = o.h + dy
  if (edge.includes('w')) {
    next.x = o.x + dx
    next.w = o.w - dx
  }
  if (edge.includes('n')) {
    next.y = o.y + dy
    next.h = o.h - dy
  }

  emit('resize', props.win.id, next)
}

function onResizeUp(e: PointerEvent) {
  resizing.value = false
  resizeEdge.value = null
  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {
    /* already released */
  }
}

onUnmounted(() => {
  dragging.value = false
  resizing.value = false
})
</script>

<template>
  <section
    class="window glass pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl"
    :class="[
      closing ? 'anim-sink' : 'anim-rise',
      terminal ? 'is-terminal' : '',
      win.maximized ? 'is-max' : '',
    ]"
    :style="style"
    role="dialog"
    :aria-label="win.title"
    @mousedown="emit('focus', win.id)"
  >
    <header
      class="titlebar flex shrink-0 cursor-grab items-center gap-3 px-3 py-2 active:cursor-grabbing"
      @pointerdown="onDragDown"
      @pointermove="onDragMove"
      @pointerup="onDragUp"
      @pointercancel="onDragUp"
      @dblclick.prevent="emit('maximize', win.id)"
    >
      <div class="flex items-center gap-1.5" data-win-control>
        <button
          type="button"
          class="ctrl close"
          title="Close"
          aria-label="Close window"
          @click.stop="emit('close', win.id)"
        />
        <button
          type="button"
          class="ctrl min"
          title="Minimize"
          aria-label="Minimize window"
          @click.stop="emit('minimize', win.id)"
        />
        <button
          type="button"
          class="ctrl max"
          :title="win.maximized ? 'Restore' : 'Maximize'"
          :aria-label="win.maximized ? 'Restore window' : 'Maximize window'"
          @click.stop="emit('maximize', win.id)"
        />
      </div>

      <div class="min-w-0 flex-1 text-center">
        <p class="truncate text-[13px] font-semibold tracking-tight text-ink/90">{{ win.title }}</p>
      </div>

      <div class="w-[52px]" aria-hidden="true" />
    </header>

    <div class="body custom-scroll min-h-0 flex-1 overflow-auto px-4 pb-4 pt-1">
      <slot />
    </div>

    <template v-if="!win.maximized">
      <div
        v-for="h in edges"
        :key="h.edge"
        class="resize-handle"
        :class="h.class"
        @pointerdown="onResizeDown(h.edge, $event)"
        @pointermove="onResizeMove"
        @pointerup="onResizeUp"
        @pointercancel="onResizeUp"
      />
    </template>
  </section>
</template>

<style scoped>
.window {
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 88px);
}

.window.is-max {
  max-width: none;
  max-height: none;
}

.is-terminal .body {
  padding: 0.35rem 0.85rem 0.9rem;
  font-family: var(--font-mono);
  display: flex;
  flex-direction: column;
}

.titlebar {
  background: color-mix(in oklab, white 4%, transparent);
}

.ctrl {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 0;
  padding: 0;
  cursor: pointer;
  opacity: 0.9;
}

.ctrl:hover {
  opacity: 1;
}

.ctrl.close {
  background: #e57373;
}

.ctrl.min {
  background: #e0b35a;
}

.ctrl.max {
  background: #6fbf8a;
}

.resize-handle {
  position: absolute;
  z-index: 5;
  touch-action: none;
}

.handle-n {
  top: 0;
  left: 10px;
  right: 10px;
  height: 6px;
  cursor: ns-resize;
}

.handle-s {
  bottom: 0;
  left: 10px;
  right: 10px;
  height: 6px;
  cursor: ns-resize;
}

.handle-e {
  top: 10px;
  right: 0;
  bottom: 10px;
  width: 6px;
  cursor: ew-resize;
}

.handle-w {
  top: 10px;
  left: 0;
  bottom: 10px;
  width: 6px;
  cursor: ew-resize;
}

.handle-ne {
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: nesw-resize;
}

.handle-nw {
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
}

.handle-se {
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
}

.handle-sw {
  left: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  cursor: nesw-resize;
}
</style>
