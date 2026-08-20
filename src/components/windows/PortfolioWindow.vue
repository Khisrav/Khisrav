<script setup lang="ts">
import { projects, type Project } from '@/data/content'

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  wip: 'WIP',
  archived: 'Archived',
}
</script>

<template>
  <div class="space-y-4 font-sans">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Portfolio</p>
      <h2 class="mt-1 text-xl font-semibold tracking-tight">Selected work</h2>
      <p class="mt-1 text-sm text-ink-muted">Commercial and personal projects.</p>
    </div>

    <ul class="space-y-3">
      <li v-for="project in projects" :key="project.id" class="glass-soft rounded-xl p-3.5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-[15px] font-semibold tracking-tight">{{ project.name }}</h3>
            <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ project.blurb }}</p>
          </div>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="{
              'bg-ok/20 text-ok': project.status === 'live',
              'bg-warn/20 text-warn': project.status === 'wip',
              'bg-white/10 text-ink-muted': project.status === 'archived',
            }"
          >
            {{ statusLabel[project.status] }}
          </span>
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium text-ink-muted"
          >
            {{ tag }}
          </span>
        </div>
        <div class="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
          <a
            v-if="project.href"
            :href="project.href"
            target="_blank"
            rel="noreferrer"
            class="text-primary underline-offset-4 hover:underline"
          >
            Open site →
          </a>
          <a
            v-if="project.repo"
            :href="project.repo"
            target="_blank"
            rel="noreferrer"
            class="text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            GitHub →
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>
