<script setup lang="ts">
import { contacts } from '@/data/content'
</script>

<template>
  <div class="space-y-4 font-sans">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Contacts</p>
      <h2 class="mt-1 text-xl font-semibold tracking-tight">Say hello</h2>
      <p class="mt-1 text-sm text-ink-muted">Pick a channel — I actually read these.</p>
    </div>

    <ul class="space-y-2">
      <li v-for="c in contacts" :key="c.id">
        <a
          :href="c.href"
          target="_blank"
          rel="noreferrer"
          class="glass-soft flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/6"
        >
          <span class="grid size-10 place-items-center rounded-xl bg-white/10 text-xs font-semibold">
            {{ c.label.slice(0, 2).toUpperCase() }}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-[15px] font-medium tracking-tight">{{ c.label }}</span>
            <span class="block truncate text-sm text-ink-muted">{{ c.value }}</span>
            <span class="mt-0.5 block text-[11px] text-ink-muted/80">{{ c.hint }}</span>
          </span>
          <span class="text-ink-muted" aria-hidden="true">→</span>
        </a>
      </li>
    </ul>
  </div>
</template>
