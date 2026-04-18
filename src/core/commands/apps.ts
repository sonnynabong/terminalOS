import { registerCommands } from '../commandRegistry';
import { openApp } from '../../stores/processStore';

export function registerAppCommands() {
  registerCommands([
    {
      name: 'open',
      description: 'Open a full-screen terminal application',
      usage: 'open <app_name> [args...]',
      execute: ({ parsed, output }) => {
        if (parsed.args.length === 0) {
          output({ text: `open: missing application name`, className: 'error' });
          return;
        }

        const appName = parsed.args[0].toLowerCase();
        const validApps = ['nano', 'htop', 'snake', 'calc'];
        
        if (!validApps.includes(appName)) {
          output({ text: `open: application not found: ${appName}`, className: 'error' });
          output({ text: `Available apps: ${validApps.join(', ')}` });
          return;
        }

        openApp(appName as any, parsed.args.slice(1));
      }
    },
    {
      name: 'ps',
      description: 'Report a snapshot of the current processes',
      usage: 'ps',
      execute: ({ output }) => {
        // Mock PS for MVP
        output({ text: `  PID TTY          TIME CMD` });
        output({ text: `    1 terminal 00:00:00 bash (simulated)` });
      }
    },
    {
      name: 'curl',
      description: 'Transfer a URL',
      usage: 'curl <url>',
      execute: async ({ parsed, output }) => {
        if (parsed.args.length === 0) {
          output({ text: `curl: try 'curl --help'`, className: 'error' });
          return;
        }

        const url = parsed.args[0];
        try {
          const res = await fetch(url);
          const text = await res.text();
          // Print only first 1000 chars to avoid hanging the terminal
          output({ text: text.substring(0, 1000) + (text.length > 1000 ? '\n... (truncated)' : '') });
        } catch (e: any) {
          output({ text: `curl: (6) Could not resolve host: ${url}`, className: 'error' });
        }
      }
    }
  ]);
}
