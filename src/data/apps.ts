import type { WindowId } from '@/composables/useDesktop'

export type AppDef = {
  id: WindowId
  label: string
  accent: string
  glyph: string
}

/** Desktop folder / mobile home icons */
export const deskApps: AppDef[] = [
  { id: 'portfolio', label: 'Portfolio', accent: '#9a96b8', glyph: '◇' },
  { id: 'about', label: 'About', accent: '#b890a4', glyph: '◎' },
  { id: 'skills', label: 'Skills', accent: '#7a9e92', glyph: '✦' },
  { id: 'contacts', label: 'Contacts', accent: '#b8a078', glyph: '✉' },
]

/** Extra apps shown on mobile home (not desktop folders) */
export const mobileExtraApps: AppDef[] = [
  { id: 'welcome', label: 'Terminal', accent: '#6a8f7e', glyph: '>' },
]

export const mobileDockApps: AppDef[] = [
  { id: 'portfolio', label: 'Portfolio', accent: '#9a96b8', glyph: '◇' },
  { id: 'about', label: 'About', accent: '#b890a4', glyph: '◎' },
  { id: 'contacts', label: 'Contacts', accent: '#b8a078', glyph: '✉' },
  { id: 'welcome', label: 'Terminal', accent: '#6a8f7e', glyph: '>' },
]

export const appTitles: Record<WindowId, string> = {
  welcome: 'Terminal',
  about: 'About',
  portfolio: 'Portfolio',
  contacts: 'Contacts',
  skills: 'Skills',
}
