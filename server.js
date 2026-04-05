// harry.dev — SSH portfolio server
// Usage: node server.js
// SSH in: ssh harry@your-server-ip -p 2222

import ssh2 from 'ssh2';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Server } = ssh2;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Generate host key: ssh-keygen -t rsa -b 2048 -f host_key -N ""
const HOST_KEY = process.env.HOST_KEY;

const PORT = process.env.PORT || 2222;

// ─── ANSI helpers ────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
  purple: '\x1b[35m',
  white:  '\x1b[37m',
  gray:   '\x1b[90m',
};

const g  = s => `${c.green}${s}${c.reset}`;
const b  = s => `${c.blue}${s}${c.reset}`;
const y  = s => `${c.yellow}${s}${c.reset}`;
const cy = s => `${c.cyan}${s}${c.reset}`;
const dim = s => `${c.dim}${s}${c.reset}`;
const pu = s => `${c.purple}${s}${c.reset}`;
const bold = s => `${c.bold}${s}${c.reset}`;

// ─── Content ─────────────────────────────────────────────────────
const PROJECTS = [
  {
    name: 'MiroFish',
    desc: 'AI-powered PR crisis simulation platform built on OASIS multi-agent framework.',
    stack: ['Python', 'OASIS', 'Multi-agent AI'],
    status: '◐ in dev',
  },
  {
    name: 'Cerberus AI Pipeline',
    desc: 'Async Python pipeline processing thousands of portfolio companies through multi-stage AI analysis. ~87.5% API cost reduction via prompt batching + semaphore concurrency.',
    stack: ['Python', 'Azure OpenAI', 'asyncio'],
    status: '● shipped',
  },
  {
    name: 'Yuttle.me',
    desc: 'Real-time Yale shuttle tracking app with FastAPI/OTP backend.',
    stack: ['FastAPI', 'React', 'OTP'],
    status: '● shipped',
  },
  {
    name: 'IonQ Bell State Circuit',
    desc: 'Quantum circuits (Bell state, GHZ) using IonQ SDK. Exploring hybrid quantum-classical startup archetype.',
    stack: ['IonQ SDK', 'Qiskit', 'Python'],
    status: '◌ exploring',
  },
  {
    name: 'Lux et Aliud LLC',
    desc: 'Co-founded fragrance startup. Building brand identity and e-commerce.',
    stack: ['Shopify', 'Branding', 'Ops'],
    status: '◉ active',
  },
];

const wrap = (text, width = 60) => {
  const words = text.split(' ');
  let lines = [], line = '';
  for (const word of words) {
    if ((line + word).length > width) { lines.push(line.trimEnd()); line = ''; }
    line += word + ' ';
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
};

// ─── Command handlers ─────────────────────────────────────────────
const COMMANDS = {
  help(stream) {
    stream.write([
      '',
      bold(g('available commands')),
      '',
      `  ${cy('about')}       → who i am`,
      `  ${cy('projects')}    → things i've built`,
      `  ${cy('skills')}      → technical toolkit`,
      `  ${cy('contact')}     → get in touch`,
      `  ${cy('now')}         → what i'm working on`,
      `  ${cy('clear')}       → clear screen`,
      `  ${cy('ls')}          → list sections`,
      `  ${cy('exit')}        → disconnect`,
      '',
      dim("tip: use ↑↓ to navigate history"),
      '',
    ].map(l => l + '\r\n').join(''));
  },

  about(stream) {
    stream.write([
      '',
      g('  ██╗  ██╗ ██████╗ '),
      g('  ██║  ██║██╔════╝ '),
      g('  ███████║██║  ███╗'),
      g('  ██╔══██║██║   ██║'),
      g('  ██║  ██║╚██████╔╝'),
      g('  ╚═╝  ╚═╝ ╚═════╝ '),
      '',
      `  ${dim('name        ')}${cy('Harry Gallen')}`,
      `  ${dim('school      ')}${cy('Cornell University — CS, Class of 2027')}`,
      `  ${dim('focus       ')}${cy('Quantum computing, AI systems, multi-agent')}`,
      `  ${dim('internship  ')}${cy('Cerberus Technology Solutions (Summer 2025)')}`,
      `  ${dim('hobbies     ')}${cy('Bass guitar · Sketch comedy · Fragrance')}`,
      `  ${dim('side        ')}${cy('Design Build Fly · Prediction markets')}`,
      '',
      "  CS junior at Cornell interested in quantum computing,",
      "  multi-agent AI systems, and building things that matter.",
      '',
    ].map(l => l + '\r\n').join(''));
  },

  projects(stream) {
    const lines = ['', bold(g('$ ls -la projects/')), ''];
    PROJECTS.forEach((p, i) => {
      lines.push(`${b(`[${String(i+1).padStart(2,'0')}]`)} ${bold(p.name)}  ${dim(p.status)}`);
      const wrapped = wrap(p.desc, 58);
      wrapped.forEach(l => lines.push('     ' + l));
      lines.push('     ' + p.stack.map(s => `[${g(s)}]`).join(' '));
      lines.push('');
    });
    stream.write(lines.map(l => l + '\r\n').join(''));
  },

  skills(stream) {
    stream.write([
      '',
      bold(g('$ cat skills.json')),
      '',
      '{',
      `  ${cy('"languages"')}: ${y('["Python", "TypeScript", "Java", "C", "Q#"]')},`,
      `  ${cy('"frameworks"')}: ${y('["FastAPI", "Next.js", "React", "asyncio"]')},`,
      `  ${cy('"ai_ml"')}: ${y('["Azure OpenAI", "PyTorch", "OASIS", "LangChain"]')},`,
      `  ${cy('"quantum"')}: ${y('["IonQ SDK", "Qiskit", "Bloch sphere ops", "QFT"]')},`,
      `  ${cy('"infra"')}: ${y('["Docker", "GCP", "Azure", "Git", "Flet"]')},`,
      `  ${cy('"learning"')}: ${y('["Hybrid quantum-classical", "Multi-agent systems"]')}`,
      '}',
      '',
    ].map(l => l + '\r\n').join(''));
  },

  contact(stream) {
    stream.write([
      '',
      bold(g("$ cat contact.txt")),
      '',
      "  Let's build something interesting.",
      '',
      `  ${dim('email    ')}${cy('hg348@cornell.edu')}`,
      `  ${dim('github   ')}${b('github.com/harrygallen')}`,
      `  ${dim('linkedin ')}${b('linkedin.com/in/harrygallen')}`,
      `  ${dim('ssh      ')}${y('ssh harry@harry.dev')}`,
      '',
      dim("  Especially interested in quantum computing internships."),
      dim("  Currently pursuing roles at IonQ and similar companies."),
      '',
    ].map(l => l + '\r\n').join(''));
  },

  now(stream) {
    stream.write([
      '',
      bold(g('$ cat now.txt')),
      '',
      `  ${y("what i'm doing right now ✦")}`,
      '',
      `  ${pu('→')} Pursuing quantum computing internship at ${cy('IonQ')}`,
      `  ${pu('→')} Building ${cy('MiroFish')} — AI PR crisis simulation platform`,
      `  ${pu('→')} ML, networking, and quantum coursework at Cornell`,
      `  ${pu('→')} Treasurer of ${cy('HumorUs')} — Cornell sketch comedy`,
      `  ${pu('→')} Playing bass, running ${cy('Lux et Aliud LLC')}`,
      '',
      dim('  last updated: April 2026'),
      '',
    ].map(l => l + '\r\n').join(''));
  },

  ls(stream) {
    stream.write(`${g('about/')}   ${g('projects/')}   ${g('skills/')}   ${g('contact/')}   ${g('now/')}\r\n\r\n`);
  },

  whoami(stream) { stream.write('harry\r\n'); },
  pwd(stream)    { stream.write(dim('/home/harry/portfolio') + '\r\n'); },
  date(stream)   { stream.write(new Date().toString() + '\r\n'); },

  sudo(stream)   { stream.write(`${c.red}Permission denied. Nice try.\r\n${c.reset}`); },
  vim(stream)    { stream.write(dim('This is a portfolio, not an IDE.\r\n')); },
  nano(stream)   { stream.write(dim('This is a portfolio, not an IDE.\r\n')); },
  coffee(stream) { stream.write(y('☕ Brewing... (IPA actually)\r\n')); },
};

// ─── Session handler ──────────────────────────────────────────────
function handleSession(stream) {
  let inputBuf = '';
  let cmdHistory = [];
  let histIdx = -1;
  let col = 0; // cursor position in current input

  const PROMPT = () =>
    `\r${g('harry')}${dim('@')}${b('portfolio')}${dim(':~$ ')}`;

  const BOOT = [
    '',
    dim('─────────────────────────────────────────────────'),
    ` ${bold(g('harry gallen'))} ${dim('// cornell cs \'27')}`,
    ` ${dim('software engineer · quantum curious · bass player')}`,
    dim('─────────────────────────────────────────────────'),
    '',
    ` ${cy('quantum')} · ${cy('multi-agent ai')} · ${cy('sketch comedy')} · ${cy('bass')}`,
    '',
    ` type ${y('help')} to see available commands`,
    '',
  ];

  stream.write(BOOT.map(l => l + '\r\n').join(''));
  stream.write(PROMPT());

  stream.on('data', data => {
    const str = data.toString();

    // Arrow up
    if (str === '\x1b[A') {
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        inputBuf = cmdHistory[cmdHistory.length - 1 - histIdx];
        col = inputBuf.length;
        stream.write('\x1b[2K' + PROMPT() + inputBuf);
      }
      return;
    }

    // Arrow down
    if (str === '\x1b[B') {
      if (histIdx > 0) {
        histIdx--;
        inputBuf = cmdHistory[cmdHistory.length - 1 - histIdx];
      } else {
        histIdx = -1;
        inputBuf = '';
      }
      col = inputBuf.length;
      stream.write('\x1b[2K' + PROMPT() + inputBuf);
      return;
    }

    // Ctrl+C
    if (str === '\x03') {
      stream.write('^C\r\n' + PROMPT());
      inputBuf = ''; col = 0; histIdx = -1;
      return;
    }

    // Ctrl+L — clear
    if (str === '\x0c') {
      stream.write('\x1b[2J\x1b[H' + PROMPT());
      inputBuf = ''; col = 0;
      return;
    }

    // Backspace
    if (str === '\x7f' || str === '\x08') {
      if (col > 0) {
        inputBuf = inputBuf.slice(0, col - 1) + inputBuf.slice(col);
        col--;
        stream.write('\x1b[2K' + PROMPT() + inputBuf);
        if (col < inputBuf.length) {
          // reposition cursor
          stream.write(`\x1b[${inputBuf.length - col}D`);
        }
      }
      return;
    }

    // Enter
    if (str === '\r' || str === '\n') {
      const cmd = inputBuf.trim();
      stream.write('\r\n');
      inputBuf = ''; col = 0; histIdx = -1;

      if (!cmd) { stream.write(PROMPT()); return; }

      cmdHistory.push(cmd);

      if (cmd === 'exit' || cmd === 'quit' || cmd === 'logout') {
        stream.write(dim('Goodbye!\r\n'));
        stream.end();
        return;
      }

      if (cmd === 'clear') {
        stream.write('\x1b[2J\x1b[H' + PROMPT());
        return;
      }

      const handler = COMMANDS[cmd.split(' ')[0]];
      if (handler) {
        handler(stream);
      } else {
        stream.write(`${c.red}command not found: ${cmd}${c.reset} ${dim("— try 'help'")}\r\n`);
      }

      stream.write(PROMPT());
      return;
    }

    // Regular character
    if (str >= ' ') {
      inputBuf = inputBuf.slice(0, col) + str + inputBuf.slice(col);
      col += str.length;
      stream.write('\x1b[2K' + PROMPT() + inputBuf);
      if (col < inputBuf.length) {
        stream.write(`\x1b[${inputBuf.length - col}D`);
      }
    }
  });

  stream.on('close', () => stream.end());
}

// ─── SSH server ───────────────────────────────────────────────────
const server = new Server({ hostKeys: [HOST_KEY] }, client => {
  console.log('Client connected:', client._sock.remoteAddress);

  // Accept all auth (public portfolio — no auth needed)
  client.on('authentication', ctx => ctx.accept());

  client.on('ready', () => {
    client.on('session', accept => {
      const session = accept();
      session.on('pty', (accept) => accept && accept());
      session.on('shell', accept => {
        const stream = accept();
        handleSession(stream);
      });
      session.on('exec', (accept, reject, info) => {
        // Allow piping: ssh harry@host -- help
        const stream = accept();
        const cmd = info.command.trim();
        const handler = COMMANDS[cmd.split(' ')[0]];
        if (handler) { handler(stream); }
        else { stream.write(`command not found: ${cmd}\r\n`); }
        stream.exit(0);
        stream.end();
      });
    });
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SSH portfolio server running on port ${PORT}`);
  console.log(`Connect: ssh -p ${PORT} harry@localhost`);
});
