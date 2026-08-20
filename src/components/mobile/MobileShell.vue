<script setup lang="ts">
import { computed, ref } from 'vue'
import DesktopWallpaper from '@/components/DesktopWallpaper.vue'
import MobileStatusBar from '@/components/mobile/MobileStatusBar.vue'
import MobileHome from '@/components/mobile/MobileHome.vue'
import MobileAppScreen from '@/components/mobile/MobileAppScreen.vue'
import TerminalWelcome from '@/components/windows/TerminalWelcome.vue'
import AboutWindow from '@/components/windows/AboutWindow.vue'
import PortfolioWindow from '@/components/windows/PortfolioWindow.vue'
import ContactsWindow from '@/components/windows/ContactsWindow.vue'
import SkillsWindow from '@/components/windows/SkillsWindow.vue'
import {
  appTitles,
  deskApps,
  mobileDockApps,
  mobileExtraApps,
} from '@/data/apps'
import type { WindowId } from '@/composables/useDesktop'

const activeId = ref<WindowId | null>(null)
const closing = ref(false)

const homeApps = computed(() => [...deskApps, ...mobileExtraApps])

function openApp(id: WindowId) {
  closing.value = false
  activeId.value = id
}

function goHome() {
  if (!activeId.value || closing.value) return
  closing.value = true
  window.setTimeout(() => {
    activeId.value = null
    closing.value = false
  }, 200)
}

function onTerminalOpen(id: WindowId) {
  if (id === 'welcome') return
  openApp(id)
}

const activeTitle = computed(() => (activeId.value ? appTitles[activeId.value] : ''))
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <DesktopWallpaper />
    <div class="relative z-10 flex h-full flex-col">
      <MobileStatusBar />
      <div class="min-h-0 flex-1">
        <MobileHome :apps="homeApps" :dock="mobileDockApps" @open="openApp" />
      </div>
    </div>

    <MobileAppScreen
      v-if="activeId"
      :title="activeTitle"
      :closing="closing"
      @back="goHome"
    >
      <TerminalWelcome
        v-if="activeId === 'welcome'"
        @exit="goHome"
        @open="onTerminalOpen"
      />
      <AboutWindow v-else-if="activeId === 'about'" />
      <PortfolioWindow v-else-if="activeId === 'portfolio'" />
      <ContactsWindow v-else-if="activeId === 'contacts'" />
      <SkillsWindow v-else-if="activeId === 'skills'" />
    </MobileAppScreen>
  </div>
</template>
