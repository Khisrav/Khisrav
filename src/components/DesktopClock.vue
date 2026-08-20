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

function timeParts(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function dateLine(d: Date) {
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div
    class="pointer-events-none absolute left-6 top-[30%] z-[1] hidden select-none sm:block md:left-10 lg:left-14"
    aria-hidden="true"
  >
    <p class="text-[clamp(3rem,7vw,5.5rem)] font-medium leading-none tracking-[-0.04em] text-ink/55">
      {{ timeParts(now) }}
    </p>
    <p class="mt-2 text-base font-medium tracking-tight text-ink-muted/70 md:text-lg">
      {{ dateLine(now) }}
    </p>
  </div>
</template>
