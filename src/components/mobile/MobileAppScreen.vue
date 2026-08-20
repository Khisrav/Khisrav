<script setup lang="ts">
defineProps<{
  title: string
  closing?: boolean
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <section
    class="absolute inset-0 z-40 flex flex-col bg-[#16141c]/92 backdrop-blur-xl"
    :class="closing ? 'mobile-out' : 'mobile-in'"
    role="dialog"
    :aria-label="title"
  >
    <header
      class="flex shrink-0 items-center gap-1 border-b border-white/8 px-2 pb-2 pt-[max(0.25rem,env(safe-area-inset-top))]"
    >
      <button
        type="button"
        class="flex items-center gap-0.5 rounded-xl px-2 py-2 text-[15px] font-medium text-primary active:opacity-70"
        @click="emit('back')"
      >
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Home
      </button>
      <h1 class="flex-1 pr-14 text-center text-[15px] font-semibold tracking-tight">{{ title }}</h1>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.mobile-in {
  animation: mobile-in 0.28s cubic-bezier(0.2, 0.85, 0.25, 1) both;
}

.mobile-out {
  animation: mobile-out 0.22s ease-in both;
}

@keyframes mobile-in {
  from {
    opacity: 0.6;
    transform: translateY(12%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes mobile-out {
  to {
    opacity: 0;
    transform: translateY(8%) scale(0.98);
  }
}
</style>
