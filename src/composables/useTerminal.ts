import { profile, projects, contacts } from '@/data/content'
import type { WindowId } from '@/composables/useDesktop'

export type TermLine = {
  kind: 'in' | 'out' | 'err' | 'muted'
  text: string
}

const HELP = [
  'Available commands:',
  '  help, man [cmd]   — list help or describe a command',
  '  time, date        — show current time / date',
  '  whoami, about     — short intro',
  '  projects, ls      — list portfolio projects',
  '  contact           — contact links',
  '  open <app>        — open about | portfolio | contacts | skills',
  '  clear             — clear the screen',
  '  exit, logout      — close this terminal',
].join('\n')

const MAN: Record<string, string> = {
  help: 'help — list available commands',
  man: 'man [command] — show a short manual for a command',
  time: 'time — print the current local time',
  date: 'date — print the current local date (and time)',
  whoami: 'whoami — print the logged-in identity',
  about: 'about — short bio',
  projects: 'projects — list portfolio projects',
  ls: 'ls — alias for projects',
  contact: 'contact — print email, telegram, github, phone',
  open: 'open <app> — open a desktop/mobile app window',
  clear: 'clear — clear terminal output',
  exit: 'exit — close the terminal session',
  logout: 'logout — alias for exit',
}

export type CommandResult = {
  lines: TermLine[]
  exit?: boolean
  clear?: boolean
  open?: WindowId
}

export function runCommand(raw: string): CommandResult {
  const input = raw.trim()
  if (!input) return { lines: [] }

  const parts = input.split(/\s+/)
  const cmd = parts[0] ?? ''
  const arg = parts.slice(1).join(' ').trim()
  const name = cmd.toLowerCase()

  switch (name) {
    case 'help':
      return { lines: [{ kind: 'out', text: HELP }] }

    case 'man': {
      if (!arg) return { lines: [{ kind: 'out', text: MAN.man ?? 'man [command]' }] }
      const key = arg.toLowerCase()
      const text = MAN[key]
      if (!text) return { lines: [{ kind: 'err', text: `man: no entry for '${arg}'` }] }
      return { lines: [{ kind: 'out', text }] }
    }

    case 'time': {
      const t = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      return { lines: [{ kind: 'out', text: t }] }
    }

    case 'date': {
      const d = new Date().toLocaleString([], {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      return { lines: [{ kind: 'out', text: d }] }
    }

    case 'whoami':
      return { lines: [{ kind: 'out', text: `${profile.handle} · ${profile.fullName}` }] }

    case 'about':
      return {
        lines: profile.about.map((t) => ({ kind: 'out' as const, text: t })),
      }

    case 'projects':
    case 'ls': {
      const lines: TermLine[] = projects.map(
        (p) =>
          ({
            kind: 'out',
            text: `${p.name.padEnd(14)} ${p.status.padEnd(6)} ${p.href ?? p.repo ?? ''}`,
          }) as TermLine,
      )
      return { lines }
    }

    case 'contact': {
      const lines: TermLine[] = contacts.map(
        (c) => ({ kind: 'out', text: `${c.label.padEnd(10)} ${c.value}` }) as TermLine,
      )
      return { lines }
    }

    case 'open': {
      const map: Record<string, WindowId> = {
        about: 'about',
        portfolio: 'portfolio',
        contacts: 'contacts',
        contact: 'contacts',
        skills: 'skills',
        terminal: 'welcome',
        welcome: 'welcome',
      }
      const key = arg.toLowerCase()
      const id = map[key]
      if (!id) {
        return {
          lines: [
            {
              kind: 'err',
              text: `open: unknown app '${arg || ''}'. try: about, portfolio, contacts, skills`,
            },
          ],
        }
      }
      return {
        lines: [{ kind: 'muted', text: `opening ${key}…` }],
        open: id,
      }
    }

    case 'clear':
      return { lines: [], clear: true }

    case 'exit':
    case 'logout':
      return { lines: [{ kind: 'muted', text: 'closing session…' }], exit: true }

    case 'echo':
      return { lines: [{ kind: 'out', text: arg }] }

    default:
      return {
        lines: [
          {
            kind: 'err',
            text: `command not found: ${cmd}. type help`,
          },
        ],
      }
  }
}
