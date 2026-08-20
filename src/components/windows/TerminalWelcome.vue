<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { terminalLines } from '@/data/content'

const visibleCount = ref(0)
const typed = ref('')
const phase = ref<'lines' | 'typing' | 'done'>('lines')
let timers: number[] = []

const promptPrefix = 'guest@desktop ~ ❯ '

onMounted(() => {
  let delay = 280
  terminalLines.forEach((line, index) => {
    const id = window.setTimeout(() => {
      visibleCount.value = index + 1
      if (index === terminalLines.length - 1) {
        phase.value = 'typing'
        typeIdle()
      }
    }, delay)
    timers.push(id)
    delay += line.type === 'out' && line.text === '' ? 120 : 220
  })
})

function typeIdle() {
  const cmd = 'open portfolio'
  let i = 0
  const tick = () => {
    if (i <= cmd.length) {
      typed.value = cmd.slice(0, i)
      i += 1
      timers.push(window.setTimeout(tick, 55 + Math.random() * 40))
    } else {
      phase.value = 'done'
    }
  }
  timers.push(window.setTimeout(tick, 400))
}

onUnmounted(() => {
  timers.forEach((t) => window.clearTimeout(t))
})
</script>

<template>
  <div class="term text-[12.5px] leading-relaxed text-ink sm:text-[13px]">
    <p class="mb-3 text-[11px] font-medium tracking-wide text-ink-muted">
      session · fish · {{ new Date().getFullYear() }}
    </p>

    <div v-for="(line, i) in terminalLines.slice(0, visibleCount)" :key="i" class="min-h-[1.35em]">
      <template v-if="line.type === 'prompt'">
        <span class="text-tertiary">{{ promptPrefix }}</span>
        <span class="text-primary">{{ line.text }}</span>
      </template>
      <template v-else>
        <span class="text-ink/90">{{ line.text || '\u00a0' }}</span>
      </template>
    </div>

    <div v-if="phase !== 'lines'" class="min-h-[1.35em]">
      <span class="text-tertiary">{{ promptPrefix }}</span>
      <span class="text-primary">{{ typed }}</span>
      <span class="cursor-blink ml-0.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[2px] rounded-[2px] bg-primary align-middle" />
    </div>
  </div>
</template>
