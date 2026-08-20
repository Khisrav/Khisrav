<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { AppDef } from '@/data/apps'

defineProps<{
  apps: AppDef[]
  dock: AppDef[]
}>()

const emit = defineEmits<{
  open: [id: AppDef['id']]
}>()

const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 30_000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatDate(d: Date) {
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="flex h-full flex-col px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
    <div class="mt-5 select-none px-1 sm:mt-6">
      <p class="text-[clamp(3.5rem,14vw,4.5rem)] font-light leading-none tracking-[-0.04em] text-ink/90">
        {{ formatTime(now) }}
      </p>
      <p class="mt-2 text-[15px] font-medium text-ink-muted">{{ formatDate(now) }}</p>
    </div>

    <div class="mt-8 grid grid-cols-4 gap-x-2 gap-y-5 xs:gap-x-3">
      <button
        v-for="app in apps"
        :key="app.id"
        type="button"
        class="flex flex-col items-center gap-1.5 active:opacity-70"
        @click="emit('open', app.id)"
      >
        <span
          class="grid size-[3.6rem] place-items-center rounded-[1.1rem] text-lg font-semibold text-surface/75 shadow-md sm:size-[3.85rem] sm:rounded-[1.15rem]"
          :style="{ background: app.accent }"
        >
          {{ app.glyph }}
        </span>
        <span class="max-w-full truncate text-[11px] font-medium text-ink/90">{{ app.label }}</span>
      </button>
    </div>

    <div class="mt-auto pt-6">
      <div class="glass flex items-center justify-around rounded-[1.75rem] px-2 py-3">
        <button
          v-for="app in dock"
          :key="`dock-${app.id}`"
          type="button"
          class="grid size-[3.6rem] place-items-center rounded-[1.1rem] text-lg font-semibold text-surface/75 shadow-md active:scale-95 sm:size-[3.85rem]"
          :style="{ background: app.accent }"
          :aria-label="app.label"
          @click="emit('open', app.id)"
        >
          {{ app.glyph }}
        </button>
      </div>
      <div class="mx-auto mt-3 h-1 w-28 rounded-full bg-ink/35" aria-hidden="true" />
    </div>
  </div>
</template>
