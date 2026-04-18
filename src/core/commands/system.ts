import { registerCommands, getAllCommands } from '../commandRegistry';

export function registerSystemCommands() {
  registerCommands([
    {
      name: 'help',
      description: 'Display information about built-in commands',
      usage: 'help [command]',
      execute: ({ parsed, output }) => {
        if (parsed.args.length > 0) {
          const target = parsed.args[0];
          const cmd = getAllCommands().find(c => c.name === target);
          if (cmd) {
            output({ text: `${cmd.name} - ${cmd.description}` });
            output({ text: `Usage: ${cmd.usage}` });
          } else {
            output({ text: `help: no help topics match \`${target}\``, className: 'error' });
          }
          return;
        }

        output({ text: 'TerminalOS, version 1.0.0-release (web)' });
        output({ text: 'These shell commands are defined internally.  Type `help` to see this list.' });
        output({ text: 'Type `help name` to find out more about the function `name`.' });
        output({ text: ' ' });
        
        const commands = getAllCommands();
        
        // Simple 2-column format
        let htmlStr = '<div style="display: grid; grid-template-columns: 100px 1fr; gap: 4px;">';
        for (const cmd of commands) {
          htmlStr += `<div><strong>${cmd.name}</strong></div><div>${cmd.description}</div>`;
        }
        htmlStr += '</div>';
        
        output({ text: htmlStr, isHTML: true });
      }
    },
    {
      name: 'clear',
      description: 'Clear the terminal screen',
      usage: 'clear',
      execute: ({ clear }) => {
        clear();
      }
    },
    {
      name: 'whoami',
      description: 'Print effective userid',
      usage: 'whoami',
      execute: ({ output }) => {
        output({ text: 'user' });
      }
    },
    {
      name: 'date',
      description: 'Print or set the system date and time',
      usage: 'date',
      execute: ({ output }) => {
        output({ text: new Date().toString() });
      }
    },
    {
      name: 'uptime',
      description: 'Tell how long the system has been running.',
      usage: 'uptime',
      execute: ({ output }) => {
        output({ text: 'up 0 days, 0 hours, 5 minutes, 1 user, load average: 0.00, 0.01, 0.05' });
      }
    },
    {
      name: 'echo',
      description: 'Write arguments to the standard output',
      usage: 'echo [STRING]...',
      execute: ({ parsed, output }) => {
        output({ text: parsed.args.join(' ') });
      }
    }
  ]);
}
