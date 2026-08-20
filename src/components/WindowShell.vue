<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import type { WindowId, WindowState } from '@/composables/useDesktop'

const props = defineProps<{
  win: WindowState
  closing?: boolean
  terminal?: boolean
}>()

const emit = defineEmits<{
  focus: [id: WindowId]
  close: [id: WindowId]
  minimize: [id: WindowId]
  move: [id: WindowId, x: number, y: number]
}>()

const dragging = ref(false)
const origin = ref({ mx: 0, my: 0, x: 0, y: 0 })

const style = computed(() => ({
  left: `${props.win.x}px`,
  top: `${props.win.y}px`,
  width: `${props.win.w}px`,
  height: `${props.win.h}px`,
  zIndex: props.win.z,
}))

function onPointerDown(e: PointerEvent) {
  if ((e.target as HTMLElement).closest('[data-win-control]')) return
  emit('focus', props.win.id)
  dragging.value = true
  origin.value = {
    mx: e.clientX,
    my: e.clientY,
    x: props.win.x,
    y: props.win.y,
  }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const dx = e.clientX - origin.value.mx
  const dy = e.clientY - origin.value.my
  emit('move', props.win.id, origin.value.x + dx, origin.value.y + dy)
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false
  try {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  } catch {
    /* already released */
  }
}

onUnmounted(() => {
  dragging.value = false
})
</script>

<template>
  <section
    class="window glass pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl"
    :class="[closing ? 'anim-sink' : 'anim-rise', terminal ? 'is-terminal' : '']"
    :style="style"
    role="dialog"
    :aria-label="win.title"
    @mousedown="emit('focus', win.id)"
  >
    <header
      class="titlebar flex shrink-0 cursor-grab items-center gap-3 px-3 py-2 active:cursor-grabbing"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
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
        <button type="button" class="ctrl max" title="Focus" aria-label="Focus window" @click.stop="emit('focus', win.id)" />
      </div>

      <div class="min-w-0 flex-1 text-center">
        <p class="truncate text-[13px] font-semibold tracking-tight text-ink/90">{{ win.title }}</p>
      </div>

      <div class="w-[52px]" aria-hidden="true" />
    </header>

    <div class="body min-h-0 flex-1 overflow-auto px-4 pb-4 pt-1">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.window {
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 88px);
}

.is-terminal .body {
  padding: 0.35rem 0.85rem 0.9rem;
  font-family: var(--font-mono);
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
</style>
