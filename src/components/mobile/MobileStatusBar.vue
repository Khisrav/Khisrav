<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

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
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
</script>

<template>
  <div
    class="flex items-center justify-between px-5 pt-[max(0.35rem,env(safe-area-inset-top))] text-[13px] font-semibold tracking-tight text-ink"
  >
    <span class="tabular-nums">{{ formatTime(now) }}</span>
    <div class="flex items-center gap-1.5 text-ink/85" aria-hidden="true">
      <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 16h2v4H2v-4zm4-3h2v7H6v-7zm4-3h2v10h-2V10zm4-3h2v13h-2V7zm4-4h2v17h-2V3z" />
      </svg>
      <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 3C7.5 3 3.7 5.1 1.4 8.3l1.5 1.3C4.9 7 8.2 5.3 12 5.3s7.1 1.7 9.1 4.3l1.5-1.3C20.3 5.1 16.5 3 12 3zm0 5.3c-2.8 0-5.3 1.1-7.1 2.9l1.5 1.4c1.4-1.4 3.4-2.3 5.6-2.3s4.2.9 5.6 2.3l1.5-1.4C17.3 9.4 14.8 8.3 12 8.3zm0 5.3c-1.4 0-2.6.5-3.5 1.4L12 19l3.5-4c-.9-.9-2.1-1.4-3.5-1.4z"
        />
      </svg>
      <span class="relative ml-0.5 h-3 w-6 rounded-[3px] border border-ink/70 p-px">
        <span class="block h-full w-[72%] rounded-[1px] bg-ink/80" />
        <span class="absolute top-1/2 -right-[3px] h-1.5 w-[2px] -translate-y-1/2 rounded-r-sm bg-ink/70" />
      </span>
    </div>
  </div>
</template>
