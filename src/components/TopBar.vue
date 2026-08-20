<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { profile } from '@/data/content'

const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(d: Date) {
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}
</script>

<template>
  <header class="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
    <div
      class="glass pointer-events-auto flex max-w-full items-center gap-2 rounded-full px-2.5 py-1.5 sm:gap-3 sm:px-3"
    >
      <div class="flex items-center gap-1.5 pl-0.5">
        <span class="workspace active" title="Desktop" />
        <span class="workspace" title="Empty" />
        <span class="workspace" title="Empty" />
      </div>

      <div class="hidden h-4 w-px bg-white/10 sm:block" />

      <div class="flex min-w-0 items-center gap-2 px-0.5">
        <img
          :src="profile.avatar"
          :alt="profile.fullName"
          width="24"
          height="24"
          class="size-6 rounded-full object-cover ring-1 ring-white/15"
          loading="lazy"
          decoding="async"
        />
        <p class="truncate text-sm font-medium tracking-tight">{{ profile.name }}</p>
      </div>

      <div class="ml-auto flex items-center gap-2 pr-0.5 sm:ml-1">
        <div class="text-right leading-tight">
          <p class="text-sm font-medium tabular-nums tracking-tight">{{ formatTime(now) }}</p>
          <p class="text-[11px] text-ink-muted">{{ formatDate(now) }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.workspace {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in oklab, white 18%, transparent);
}

.workspace.active {
  width: 18px;
  background: color-mix(in oklab, var(--color-primary) 70%, white 10%);
}
</style>
