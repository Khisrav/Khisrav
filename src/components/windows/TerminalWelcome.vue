<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { terminalBoot } from '@/data/content'
import { runCommand, type TermLine } from '@/composables/useTerminal'
import type { WindowId } from '@/composables/useDesktop'

const emit = defineEmits<{
  exit: []
  open: [id: WindowId]
}>()

const promptPrefix = 'guest@desktop ~ ❯ '
const lines = ref<TermLine[]>([])
const input = ref('')
const history = ref<string[]>([])
const histIdx = ref(-1)
const bootDone = ref(false)
const scroller = ref<HTMLElement | null>(null)
const field = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  for (const row of terminalBoot) {
    lines.value.push({ kind: 'out', text: row.text })
    await sleep(90)
    await scrollBottom()
  }
  bootDone.value = true
  await nextTick()
  field.value?.focus()
})

function sleep(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms))
}

async function scrollBottom() {
  await nextTick()
  const el = scroller.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(
  () => lines.value.length,
  () => {
    void scrollBottom()
  },
)

function focusInput() {
  field.value?.focus()
}

async function submit() {
  if (!bootDone.value) return
  const raw = input.value
  lines.value.push({ kind: 'in', text: raw })
  if (raw.trim()) {
    history.value.push(raw)
  }
  histIdx.value = -1
  input.value = ''

  const result = runCommand(raw)
  if (result.clear) {
    lines.value = []
  } else {
    lines.value.push(...result.lines)
  }

  if (result.open) emit('open', result.open)
  if (result.exit) {
    await sleep(180)
    emit('exit')
  }
  await scrollBottom()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!history.value.length) return
    if (histIdx.value < 0) histIdx.value = history.value.length - 1
    else histIdx.value = Math.max(0, histIdx.value - 1)
    input.value = history.value[histIdx.value] ?? ''
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (histIdx.value < 0) return
    histIdx.value += 1
    if (histIdx.value >= history.value.length) {
      histIdx.value = -1
      input.value = ''
    } else {
      input.value = history.value[histIdx.value] ?? ''
    }
  } else if (e.key === 'c' && e.ctrlKey) {
    e.preventDefault()
    lines.value.push({ kind: 'in', text: input.value + '^C' })
    input.value = ''
    histIdx.value = -1
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault()
    lines.value = []
  }
}
</script>

<template>
  <div
    ref="scroller"
    class="term flex h-full min-h-[200px] flex-col text-[12.5px] leading-relaxed text-ink sm:text-[13px]"
    @click="focusInput"
  >
    <p class="mb-2 shrink-0 text-[11px] font-medium tracking-wide text-ink-muted">
      session · fish · {{ new Date().getFullYear() }}
    </p>

    <div class="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
      <div v-for="(line, i) in lines" :key="i" class="whitespace-pre-wrap break-words">
        <template v-if="line.kind === 'in'">
          <span class="text-tertiary">{{ promptPrefix }}</span>
          <span class="text-primary">{{ line.text }}</span>
        </template>
        <span
          v-else
          :class="{
            'text-ink/90': line.kind === 'out',
            'text-danger': line.kind === 'err',
            'text-ink-muted': line.kind === 'muted',
          }"
        >
          {{ line.text || '\u00a0' }}
        </span>
      </div>

      <div v-if="bootDone" class="flex min-h-[1.35em] items-baseline">
        <span class="shrink-0 text-tertiary">{{ promptPrefix }}</span>
        <input
          ref="field"
          v-model="input"
          type="text"
          class="ml-0 min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[inherit] text-primary outline-none"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          aria-label="Terminal input"
          @keydown="onKeydown"
          @keydown.enter.prevent="submit"
        />
      </div>
      <div v-else class="min-h-[1.35em]">
        <span class="text-tertiary">{{ promptPrefix }}</span>
        <span
          class="cursor-blink ml-0.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[2px] rounded-[2px] bg-primary align-middle"
        />
      </div>
    </div>
  </div>
</template>
