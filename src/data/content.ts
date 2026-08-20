export const profile = {
  name: 'Khisrav',
  handle: 'khisrav',
  location: 'Somewhere online',
  tagline: 'Making things that feel nice to use.',
  about: [
    "Hey — I'm Khisrav. I like clean systems, expressive UI, and Linux desktops that feel alive.",
    'This page is my little Hyprland-flavored calling card: open folders, poke around, say hi.',
  ],
}

export type Project = {
  id: string
  name: string
  blurb: string
  tags: string[]
  href?: string
  status: 'live' | 'wip' | 'archived'
}

export const projects: Project[] = [
  {
    id: 'desktop-site',
    name: 'This Desktop',
    blurb: 'A personal site dressed as a Material You / Hyprland desktop — folders, glass windows, terminal greeting.',
    tags: ['Vue', 'Tailwind', 'UI'],
    status: 'live',
  },
  {
    id: 'rice',
    name: 'Shell Experiments',
    blurb: 'Dotfiles, panels, and motion studies inspired by caelestia-shell and Material 3 Expressive.',
    tags: ['Hyprland', 'Quickshell', 'CSS'],
    status: 'wip',
  },
  {
    id: 'tools',
    name: 'Small Tools',
    blurb: 'Little utilities and scripts that remove friction from daily workflows.',
    tags: ['TypeScript', 'CLI'],
    status: 'wip',
  },
]

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'Python', 'Rust (learning)', 'Bash'] },
  { group: 'Frontend', items: ['Vue', 'CSS / design systems', 'Motion', 'Accessibility'] },
  { group: 'Systems', items: ['Linux', 'Hyprland', 'Git', 'Docker'] },
  { group: 'Vibes', items: ['Material 3', 'Liquid glass', 'Thoughtful typography'] },
]

export type Contact = {
  id: string
  label: string
  value: string
  href: string
  hint: string
}

export const contacts: Contact[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'hello@khisrav.dev',
    href: 'mailto:hello@khisrav.dev',
    hint: 'Best for thoughtful notes',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/khisrav',
    href: 'https://github.com/khisrav',
    hint: 'Code & experiments',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    value: '@khisrav',
    href: 'https://t.me/khisrav',
    hint: 'Quick pings',
  },
]

export const terminalLines = [
  { type: 'prompt' as const, text: 'welcome --user guest' },
  { type: 'out' as const, text: `Hey! I'm ${profile.name}.` },
  { type: 'out' as const, text: profile.tagline },
  { type: 'out' as const, text: '' },
  { type: 'out' as const, text: 'Tips:' },
  { type: 'out' as const, text: '  · Open apps from the home screen / folders' },
  { type: 'out' as const, text: '  · On desktop, drag windows by the title bar' },
  { type: 'out' as const, text: '' },
  { type: 'out' as const, text: 'Have a look around — portfolio & contacts await.' },
  { type: 'prompt' as const, text: '' },
]
