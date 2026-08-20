<script setup lang="ts">
import { profile } from '@/data/content'
</script>

<template>
  <div class="space-y-4 font-sans">
    <div class="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
      <p class="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">About</p>
      <h2 class="mt-1 text-2xl font-semibold tracking-tight">{{ profile.name }}</h2>
    </div>

    <p v-for="(p, i) in profile.about" :key="i" class="text-[15px] leading-relaxed text-ink/90">
      {{ p }}
    </p>

    <dl class="grid gap-2 text-sm">
      <div class="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5">
        <dt class="text-ink-muted">Location</dt>
        <dd class="font-medium">{{ profile.location }}</dd>
      </div>
      <div class="glass-soft flex items-center justify-between rounded-xl px-3 py-2.5">
        <dt class="text-ink-muted">Handle</dt>
        <dd class="font-medium">@{{ profile.handle }}</dd>
      </div>
    </dl>
  </div>
</template>
