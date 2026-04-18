import { registerCommands } from '../commandRegistry';
import { $cwd } from '../../stores/filesystemStore'; 

export function registerFunCommands() {
  registerCommands([
    {
      name: 'neofetch',
      description: 'Display system information',
      usage: 'neofetch',
      execute: ({ output }) => {
        const logo = [
          '   ▄▄▄▄▄▄▄▄▄      ',
          '  ███████████     ',
          ' █████████████    ',
          '███████████████   ',
          '███████████████   ',
          ' █████████████    ',
          '  ███████████     ',
          '   ▀▀▀▀▀▀▀▀▀      ',
        ];
        
        const info = [
          '<span style="color:#33FF33; font-weight:bold;">user@terminalOS</span>',
          '-----------------',
          `<b>OS</b>: TerminalOS v1.0`,
          `<b>Host</b>: Web Browser`,
          `<b>Kernel</b>: React 19/Astro 6`,
          `<b>Uptime</b>: 1 min`,
          `<b>Packages</b>: 42 (npm)`,
          `<b>Shell</b>: bash (simulated)`,
          `<b>Theme</b>: ${document.body.dataset.theme}`,
          `<b>CPU</b>: Unknown x86_64`,
          `<b>Memory</b>: ∞ MB / ∞ MB`
        ];

        // Combine side by side
        const result = logo.map((line, i) => {
          return `${line}    ${info[i] || ''}`;
        });

        // Add remaining info lines if any
        for (let i = logo.length; i < info.length; i++) {
          result.push(`${' '.repeat(18)}    ${info[i]}`);
        }

        output({ text: result.join('\n'), isHTML: true });
      }
    },
    {
      name: 'cowsay',
      description: 'Configurable speaking cow',
      usage: 'cowsay [message]',
      execute: ({ parsed, output }) => {
        const msg = parsed.args.length > 0 ? parsed.args.join(' ') : 'Moo!';
        const border = '-'.repeat(msg.length + 2);
        
        const cow = `
 ${border}
< ${msg} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
        `;
        
        output({ text: cow });
      }
    },
    {
      name: 'fortune',
      description: 'Print a random, hopefully interesting, adage',
      usage: 'fortune',
      execute: ({ output }) => {
        const fortunes = [
          "You will have a great day today.",
          "Beware of bugs in the above code; I have only proved it correct, not tried it.",
          "It's not a bug, it's an undocumented feature.",
          "First, solve the problem. Then, write the code.",
          "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
        ];
        const f = fortunes[Math.floor(Math.random() * fortunes.length)];
        output({ text: f });
      }
    },
    {
      name: 'matrix',
      description: 'Matrix digital rain (static version for MVP)',
      usage: 'matrix',
      execute: ({ output }) => {
        // Just print a block of green random chars for now.
        let rain = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~';
        for(let i=0; i<15; i++) {
          let line = '';
          for(let j=0; j<80; j++) {
            line += Math.random() > 0.6 ? chars.charAt(Math.floor(Math.random() * chars.length)) : ' ';
          }
          rain += line + '\n';
        }
        output({ text: `<span style="color:#00FF00;">${rain}</span>`, isHTML: true });
      }
    },
    {
      name: 'figlet',
      description: 'Make large character ASCII banners',
      usage: 'figlet [text]',
      execute: ({ parsed, output }) => {
        const msg = parsed.args.join(' ') || 'FIGLET';
        // Mock large text using simple hash mapping or just returning the msg spaced out for MVP
        // A real figlet would require a large font dict.
        output({ text: `
   ___  ___  ___ 
  / __)/ __)/ __)
 ( (_ ( (_ ( (_  ... ${msg}
  \\___)\\___)\\___)
        ` });
      }
    }
  ]);
}
