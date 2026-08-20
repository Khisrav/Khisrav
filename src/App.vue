<script setup lang="ts">
import DesktopShell from '@/components/DesktopShell.vue'
import MobileShell from '@/components/mobile/MobileShell.vue'
import { useIsMobile } from '@/composables/useIsMobile'

const isMobile = useIsMobile()
</script>

<template>
  <MobileShell v-if="isMobile" />
  <DesktopShell v-else />
</template>
