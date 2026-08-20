export const profile = {
  name: 'Khisrav',
  fullName: 'Khisrav Khudoyorov',
  handle: 'Khisrav',
  avatar: 'https://github.com/Khisrav.png?size=96',
  role: 'Fullstack developer (Laravel / Vue.js)',
  location: 'Tajikistan',
  tagline: 'Building CRM, ERP, and tools that actually ship.',
  about: [
    "I'm Khisrav Khudoyorov — a fullstack developer with 5+ years of commercial web work, mostly on Laravel and Vue.js.",
    'I design and ship CRM/ERP modules, e-commerce, configurators, and internal business tools — from architecture to production and support. I care about untangling messy business logic and leaving systems that stay maintainable.',
  ],
  education: 'Volga State University of Technology — BSc Applied Informatics (grad. 2026)',
  languages: ['Russian (fluent)', 'Tajik (native)', 'English (B2)', 'Uzbek (B1)'],
}

export type Project = {
  id: string
  name: string
  blurb: string
  tags: string[]
  href?: string
  repo?: string
  status: 'live' | 'wip' | 'archived'
}

export const projects: Project[] = [
  {
    id: 'dorston',
    name: 'Dorston',
    blurb:
      'Door configurator and dealer platform — pricing tiers, real-time product builder, PDF quotes/drawings, Filament admin, Telegram sales alerts.',
    tags: ['Laravel', 'Vue 3', 'Inertia', 'TypeScript', 'Filament', 'MySQL'],
    href: 'http://config.dorston.ru/',
    status: 'live',
  },
  {
    id: 'llymar',
    name: 'LLYMAR',
    blurb:
      'Frameless glazing configurator — automated commercial proposals, custom pricing algorithms, interactive client UI, PDF/DB optimizations.',
    tags: ['Laravel', 'Vue', 'PDF', 'Telegram'],
    href: 'https://llymar.ru/',
    repo: 'https://github.com/Khisrav/llymar',
    status: 'live',
  },
  {
    id: 'aliyacargo',
    name: 'Aliya Cargo',
    blurb: 'Cargo / logistics web app built with Vue.',
    tags: ['Vue'],
    href: 'https://aliyacargo.vercel.app',
    repo: 'https://github.com/Khisrav/aliyacargo',
    status: 'live',
  },
  {
    id: 'wherediditgo',
    name: 'wherediditgo',
    blurb: 'Personal finance tracker — know where every dollar went.',
    tags: ['Vue'],
    href: 'https://khisrav.github.io/wherediditgo/',
    repo: 'https://github.com/Khisrav/wherediditgo',
    status: 'live',
  },
]

export const skills = [
  {
    group: 'Backend',
    items: ['PHP 8+', 'Laravel', 'REST API', 'Queues', 'WebSockets', 'FilamentPHP', 'Auth / RBAC'],
  },
  {
    group: 'Frontend',
    items: ['Vue.js 3', 'Inertia.js', 'TypeScript', 'Pinia', 'TailwindCSS', 'HTML/CSS'],
  },
  {
    group: 'Data',
    items: ['MySQL', 'PostgreSQL', 'Redis', 'Supabase'],
  },
  {
    group: 'DevOps',
    items: ['Docker', 'Linux', 'Nginx', 'Git', 'GitLab CI/CD', 'PM2'],
  },
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
    id: 'telegram',
    label: 'Telegram',
    value: '@kh_tj',
    href: 'https://t.me/kh_tj',
    hint: 'Quick pings',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/Khisrav',
    href: 'https://github.com/Khisrav',
    hint: 'Code & experiments',
  },
]

export const terminalBoot = [
  { type: 'out' as const, text: `Hey! I'm ${profile.fullName}.` },
  { type: 'out' as const, text: profile.role },
  { type: 'out' as const, text: profile.tagline },
  { type: 'out' as const, text: '' },
  { type: 'out' as const, text: 'Type help to see available commands.' },
]
