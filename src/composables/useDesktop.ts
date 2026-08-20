import { computed, reactive, ref } from 'vue'

export type WindowId = 'welcome' | 'portfolio' | 'about' | 'contacts' | 'skills'

export type WindowState = {
  id: WindowId
  title: string
  open: boolean
  minimized: boolean
  z: number
  x: number
  y: number
  w: number
  h: number
}

const defaults: Record<WindowId, Omit<WindowState, 'open' | 'minimized' | 'z'>> = {
  welcome: {
    id: 'welcome',
    title: 'welcome — fish',
    x: 72,
    y: 96,
    w: 560,
    h: 360,
  },
  about: {
    id: 'about',
    title: 'About',
    x: 140,
    y: 120,
    w: 480,
    h: 420,
  },
  portfolio: {
    id: 'portfolio',
    title: 'Portfolio',
    x: 200,
    y: 100,
    w: 620,
    h: 480,
  },
  contacts: {
    id: 'contacts',
    title: 'Contacts',
    x: 260,
    y: 140,
    w: 440,
    h: 400,
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    x: 180,
    y: 150,
    w: 520,
    h: 440,
  },
}

let zCounter = 10

function clampWindow(win: WindowState) {
  if (typeof window === 'undefined') return
  const pad = 16
  const maxX = Math.max(pad, window.innerWidth - win.w - pad)
  const maxY = Math.max(72, window.innerHeight - 80)
  win.x = Math.min(Math.max(pad, win.x), maxX)
  win.y = Math.min(Math.max(64, win.y), maxY)
}

function layoutForViewport() {
  if (typeof window === 'undefined') return
  const narrow = window.innerWidth < 720
  if (!narrow) return

  for (const id of Object.keys(defaults) as WindowId[]) {
    const win = windows[id]
    win.w = Math.min(win.w, window.innerWidth - 24)
    win.x = 12
    win.y = 72
    clampWindow(win)
  }
}

export const windows = reactive<Record<WindowId, WindowState>>({
  welcome: { ...defaults.welcome, open: true, minimized: false, z: ++zCounter },
  about: { ...defaults.about, open: false, minimized: false, z: 1 },
  portfolio: { ...defaults.portfolio, open: false, minimized: false, z: 1 },
  contacts: { ...defaults.contacts, open: false, minimized: false, z: 1 },
  skills: { ...defaults.skills, open: false, minimized: false, z: 1 },
})

export const closingId = ref<WindowId | null>(null)

export function useDesktop() {
  const openWindows = computed(() =>
    (Object.values(windows) as WindowState[])
      .filter((w) => w.open && !w.minimized)
      .sort((a, b) => a.z - b.z),
  )

  const dockItems = computed(() =>
    (Object.values(windows) as WindowState[]).filter((w) => w.open || w.minimized),
  )

  function focus(id: WindowId) {
    const win = windows[id]
    if (!win.open || win.minimized) return
    win.z = ++zCounter
  }

  function open(id: WindowId) {
    const win = windows[id]
    closingId.value = null
    win.open = true
    win.minimized = false
    layoutForViewport()
    clampWindow(win)
    focus(id)
  }

  function close(id: WindowId) {
    if (closingId.value === id) return
    closingId.value = id
    window.setTimeout(() => {
      windows[id].open = false
      windows[id].minimized = false
      if (closingId.value === id) closingId.value = null
    }, 240)
  }

  function minimize(id: WindowId) {
    windows[id].minimized = true
  }

  function toggle(id: WindowId) {
    const win = windows[id]
    if (!win.open) {
      open(id)
      return
    }
    if (win.minimized) {
      win.minimized = false
      focus(id)
      return
    }
    // If already focused, minimize; else focus
    const top = Math.max(...(Object.values(windows) as WindowState[]).map((w) => w.z))
    if (win.z === top) minimize(id)
    else focus(id)
  }

  function move(id: WindowId, x: number, y: number) {
    const win = windows[id]
    win.x = x
    win.y = y
    clampWindow(win)
  }

  if (typeof window !== 'undefined') {
    layoutForViewport()
    window.addEventListener('resize', () => {
      for (const id of Object.keys(windows) as WindowId[]) {
        if (windows[id].open) clampWindow(windows[id])
      }
      layoutForViewport()
    })
  }

  return {
    windows,
    openWindows,
    dockItems,
    closingId,
    focus,
    open,
    close,
    minimize,
    toggle,
    move,
  }
}
