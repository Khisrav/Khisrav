<script setup lang="ts">
import DesktopWallpaper from '@/components/DesktopWallpaper.vue'
import DesktopClock from '@/components/DesktopClock.vue'
import TopBar from '@/components/TopBar.vue'
import DesktopIcons, { type DeskIcon } from '@/components/DesktopIcons.vue'
import WindowShell from '@/components/WindowShell.vue'
import TerminalWelcome from '@/components/windows/TerminalWelcome.vue'
import AboutWindow from '@/components/windows/AboutWindow.vue'
import PortfolioWindow from '@/components/windows/PortfolioWindow.vue'
import ContactsWindow from '@/components/windows/ContactsWindow.vue'
import SkillsWindow from '@/components/windows/SkillsWindow.vue'
import { useDesktop, type WindowId } from '@/composables/useDesktop'
import { deskApps } from '@/data/apps'

const { windows, closingId, focus, open, close, minimize, toggleMaximize, move, resize } =
  useDesktop()

const icons = deskApps as DeskIcon[]

function isVisible(id: WindowId) {
  const w = windows[id]
  return w.open && !w.minimized
}

function onTerminalOpen(id: WindowId) {
  if (id === 'welcome') {
    focus('welcome')
    return
  }
  open(id)
}
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <DesktopWallpaper />
    <DesktopClock />
    <TopBar />

    <DesktopIcons :icons="icons" @open="open" />

    <div class="pointer-events-none absolute inset-0 z-20">
      <WindowShell
        v-if="isVisible('welcome')"
        :win="windows.welcome"
        :closing="closingId === 'welcome'"
        terminal
        @focus="focus"
        @close="close"
        @minimize="minimize"
        @maximize="toggleMaximize"
        @move="move"
        @resize="resize"
      >
        <TerminalWelcome @exit="close('welcome')" @open="onTerminalOpen" />
      </WindowShell>

      <WindowShell
        v-if="isVisible('about')"
        :win="windows.about"
        :closing="closingId === 'about'"
        @focus="focus"
        @close="close"
        @minimize="minimize"
        @maximize="toggleMaximize"
        @move="move"
        @resize="resize"
      >
        <AboutWindow />
      </WindowShell>

      <WindowShell
        v-if="isVisible('portfolio')"
        :win="windows.portfolio"
        :closing="closingId === 'portfolio'"
        @focus="focus"
        @close="close"
        @minimize="minimize"
        @maximize="toggleMaximize"
        @move="move"
        @resize="resize"
      >
        <PortfolioWindow />
      </WindowShell>

      <WindowShell
        v-if="isVisible('contacts')"
        :win="windows.contacts"
        :closing="closingId === 'contacts'"
        @focus="focus"
        @close="close"
        @minimize="minimize"
        @maximize="toggleMaximize"
        @move="move"
        @resize="resize"
      >
        <ContactsWindow />
      </WindowShell>

      <WindowShell
        v-if="isVisible('skills')"
        :win="windows.skills"
        :closing="closingId === 'skills'"
        @focus="focus"
        @close="close"
        @minimize="minimize"
        @maximize="toggleMaximize"
        @move="move"
        @resize="resize"
      >
        <SkillsWindow />
      </WindowShell>
    </div>
  </div>
</template>
