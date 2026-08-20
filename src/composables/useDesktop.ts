import { computed, reactive, ref } from 'vue'

export type WindowId = 'welcome' | 'portfolio' | 'about' | 'contacts' | 'skills'

export type WindowState = {
  id: WindowId
  title: string
  open: boolean
  minimized: boolean
  maximized: boolean
  z: number
  x: number
  y: number
  w: number
  h: number
  restore: { x: number; y: number; w: number; h: number } | null
}

const defaults: Record<WindowId, Omit<WindowState, 'open' | 'minimized' | 'maximized' | 'z' | 'restore'>> =
  {
    welcome: {
      id: 'welcome',
      title: 'welcome — fish',
      x: 72,
      y: 96,
      w: 560,
      h: 380,
    },
    about: {
      id: 'about',
      title: 'About',
      x: 140,
      y: 120,
      w: 480,
      h: 460,
    },
    portfolio: {
      id: 'portfolio',
      title: 'Portfolio',
      x: 200,
      y: 100,
      w: 640,
      h: 520,
    },
    contacts: {
      id: 'contacts',
      title: 'Contacts',
      x: 260,
      y: 140,
      w: 440,
      h: 440,
    },
    skills: {
      id: 'skills',
      title: 'Skills',
      x: 180,
      y: 150,
      w: 520,
      h: 460,
    },
  }

let zCounter = 10

function clampWindow(win: WindowState) {
  if (typeof window === 'undefined' || win.maximized) return
  const pad = 16
  const maxX = Math.max(pad, window.innerWidth - Math.min(win.w, window.innerWidth - pad * 2) - pad)
  const maxY = Math.max(72, window.innerHeight - 48)
  win.x = Math.min(Math.max(pad, win.x), maxX)
  win.y = Math.min(Math.max(64, win.y), maxY)
}

function layoutForViewport() {
  if (typeof window === 'undefined') return
  const narrow = window.innerWidth < 720
  if (!narrow) return

  for (const id of Object.keys(defaults) as WindowId[]) {
    const win = windows[id]
    if (win.maximized) continue
    win.w = Math.min(win.w, window.innerWidth - 24)
    win.x = 12
    win.y = 72
    clampWindow(win)
  }
}

function applyMaximizeGeometry(win: WindowState) {
  if (typeof window === 'undefined') return
  win.x = 10
  win.y = 56
  win.w = window.innerWidth - 20
  win.h = window.innerHeight - 68
}

export const windows = reactive<Record<WindowId, WindowState>>({
  welcome: {
    ...defaults.welcome,
    open: true,
    minimized: false,
    maximized: false,
    z: ++zCounter,
    restore: null,
  },
  about: { ...defaults.about, open: false, minimized: false, maximized: false, z: 1, restore: null },
  portfolio: {
    ...defaults.portfolio,
    open: false,
    minimized: false,
    maximized: false,
    z: 1,
    restore: null,
  },
  contacts: {
    ...defaults.contacts,
    open: false,
    minimized: false,
    maximized: false,
    z: 1,
    restore: null,
  },
  skills: { ...defaults.skills, open: false, minimized: false, maximized: false, z: 1, restore: null },
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
    if (!win.maximized) {
      layoutForViewport()
      clampWindow(win)
    }
    focus(id)
  }

  function close(id: WindowId) {
    if (closingId.value === id) return
    closingId.value = id
    window.setTimeout(() => {
      windows[id].open = false
      windows[id].minimized = false
      windows[id].maximized = false
      windows[id].restore = null
      if (closingId.value === id) closingId.value = null
    }, 240)
  }

  function minimize(id: WindowId) {
    windows[id].minimized = true
  }

  function toggleMaximize(id: WindowId) {
    const win = windows[id]
    focus(id)
    if (win.maximized) {
      const r = win.restore
      win.maximized = false
      if (r) {
        win.x = r.x
        win.y = r.y
        win.w = r.w
        win.h = r.h
      }
      win.restore = null
      clampWindow(win)
      return
    }
    win.restore = { x: win.x, y: win.y, w: win.w, h: win.h }
    win.maximized = true
    applyMaximizeGeometry(win)
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
    const top = Math.max(...(Object.values(windows) as WindowState[]).map((w) => w.z))
    if (win.z === top) minimize(id)
    else focus(id)
  }

  function move(id: WindowId, x: number, y: number) {
    const win = windows[id]
    if (win.maximized) {
      const r = win.restore
      win.maximized = false
      if (r) {
        win.w = r.w
        win.h = r.h
      }
      win.restore = null
      win.x = x
      win.y = y
      clampWindow(win)
      return
    }
    win.x = x
    win.y = y
    clampWindow(win)
  }

  function resize(
    id: WindowId,
    next: Partial<Pick<WindowState, 'x' | 'y' | 'w' | 'h'>>,
  ) {
    const win = windows[id]
    if (win.maximized) return
    if (typeof window === 'undefined') return

    const minW = 320
    const minH = 240
    const pad = 8

    const resizingLeft = next.x !== undefined && next.w !== undefined
    const resizingTop = next.y !== undefined && next.h !== undefined

    let x = next.x ?? win.x
    let y = next.y ?? win.y
    let w = next.w ?? win.w
    let h = next.h ?? win.h

    if (resizingLeft) {
      const right = next.x! + next.w!
      w = Math.max(minW, next.w!)
      x = right - w
    } else {
      w = Math.max(minW, w)
    }

    if (resizingTop) {
      const bottom = next.y! + next.h!
      h = Math.max(minH, next.h!)
      y = bottom - h
    } else {
      h = Math.max(minH, h)
    }

    x = Math.max(pad, x)
    y = Math.max(56, y)
    w = Math.min(w, window.innerWidth - x - pad)
    h = Math.min(h, window.innerHeight - y - pad)
    w = Math.max(minW, w)
    h = Math.max(minH, h)

    win.x = x
    win.y = y
    win.w = w
    win.h = h
  }

  if (typeof window !== 'undefined') {
    layoutForViewport()
    window.addEventListener('resize', () => {
      for (const id of Object.keys(windows) as WindowId[]) {
        const win = windows[id]
        if (!win.open) continue
        if (win.maximized) applyMaximizeGeometry(win)
        else clampWindow(win)
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
    toggleMaximize,
    toggle,
    move,
    resize,
  }
}
