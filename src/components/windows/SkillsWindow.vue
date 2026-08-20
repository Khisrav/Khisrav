<script setup lang="ts">
import { skills } from '@/data/content'
</script>

<template>
  <div class="space-y-4 font-sans">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Skills</p>
      <h2 class="mt-1 text-xl font-semibold tracking-tight">Stack</h2>
      <p class="mt-1 text-sm text-ink-muted">What I use on commercial projects.</p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <section
        v-for="group in skills"
        :key="group.group"
        class="glass-soft rounded-[1.2rem] p-3.5"
      >
        <h3 class="text-sm font-semibold tracking-tight text-primary">{{ group.group }}</h3>
        <ul class="mt-2.5 flex flex-wrap gap-1.5">
          <li
            v-for="item in group.items"
            :key="item"
            class="rounded-full bg-white/8 px-2.5 py-1 text-[12px] font-medium text-ink/90"
          >
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
