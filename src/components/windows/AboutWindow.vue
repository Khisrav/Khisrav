<script setup lang="ts">
import { profile } from '@/data/content'
</script>

<template>
  <div class="space-y-4 font-sans">
    <div class="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
      <p class="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">About</p>
      <h2 class="mt-1 text-2xl font-semibold tracking-tight">{{ profile.fullName }}</h2>
      <p class="mt-1 text-sm text-ink-muted">{{ profile.role }}</p>
    </div>

    <p v-for="(p, i) in profile.about" :key="i" class="text-[15px] leading-relaxed text-ink/90">
      {{ p }}
    </p>

    <dl class="grid gap-2 text-sm">
      <div class="glass-soft flex items-center justify-between gap-3 rounded-xl px-3 py-2.5">
        <dt class="shrink-0 text-ink-muted">Location</dt>
        <dd class="text-right font-medium">{{ profile.location }}</dd>
      </div>
      <div class="glass-soft flex items-center justify-between gap-3 rounded-xl px-3 py-2.5">
        <dt class="shrink-0 text-ink-muted">GitHub</dt>
        <dd class="text-right font-medium">@{{ profile.handle }}</dd>
      </div>
      <div class="glass-soft rounded-xl px-3 py-2.5">
        <dt class="text-ink-muted">Education</dt>
        <dd class="mt-1 font-medium leading-snug">{{ profile.education }}</dd>
      </div>
      <div class="glass-soft rounded-xl px-3 py-2.5">
        <dt class="text-ink-muted">Languages</dt>
        <dd class="mt-1.5 flex flex-wrap gap-1.5">
          <span
            v-for="lang in profile.languages"
            :key="lang"
            class="rounded-full bg-white/8 px-2 py-0.5 text-[12px] font-medium"
          >
            {{ lang }}
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>
