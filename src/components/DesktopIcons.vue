<script setup lang="ts">
import type { WindowId } from '@/composables/useDesktop'

export type DeskIcon = {
  id: WindowId
  label: string
  accent: string
  glyph: string
}

defineProps<{
  icons: DeskIcon[]
}>()

const emit = defineEmits<{
  open: [id: WindowId]
}>()
</script>

<template>
  <nav
    class="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-end px-4 sm:top-24 sm:px-6"
    aria-label="Desktop folders"
  >
    <ul class="pointer-events-auto flex flex-col gap-2.5 sm:gap-3">
      <li v-for="icon in icons" :key="icon.id">
        <button
          type="button"
          class="group flex w-[72px] flex-col items-center gap-1.5 rounded-xl p-1.5 text-center outline-none transition-colors duration-150 hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-white/25"
          @dblclick.prevent="emit('open', icon.id)"
          @touchend.prevent="emit('open', icon.id)"
          @keydown.enter.prevent="emit('open', icon.id)"
          @keydown.space.prevent="emit('open', icon.id)"
        >
          <span
            class="folder relative grid size-12 place-items-center"
            :style="{ '--accent': icon.accent }"
          >
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
      </li>
    </ul>
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
