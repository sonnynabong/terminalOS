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
    },
    {
      name: 'ping',
      description: 'Send ICMP ECHO_REQUEST to network hosts',
      usage: 'ping <host>',
      execute: async ({ parsed, output }) => {
        if (!parsed.args[0]) {
          output({ text: 'ping: missing host operand', className: 'error' });
          return;
        }
        const host = parsed.args[0];
        output({ text: `PING ${host} (192.168.1.42): 56 data bytes` });
        
        for (let i = 1; i <= 4; i++) {
          await new Promise(r => setTimeout(r, 1000));
          const time = (Math.random() * 50 + 10).toFixed(1);
          output({ text: `64 bytes from 192.168.1.42: icmp_seq=${i} ttl=64 time=${time} ms` });
        }
        output({ text: `--- ${host} ping statistics ---` });
        output({ text: `4 packets transmitted, 4 packets received, 0.0% packet loss` });
      }
    },
    {
      name: 'ifconfig',
      description: 'Configure a network interface (simulated)',
      usage: 'ifconfig',
      execute: ({ output }) => {
        output({ text: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500` });
        output({ text: `      inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255` });
        output({ text: `      inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>` });
        output({ text: `      ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)` });
        output({ text: `      RX packets 123456  bytes 123456789 (117.7 MiB)` });
        output({ text: `      TX packets 654321  bytes 987654321 (941.9 MiB)\n` });
        
        output({ text: `lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536` });
        output({ text: `      inet 127.0.0.1  netmask 255.0.0.0` });
        output({ text: `      inet6 ::1  prefixlen 128  scopeid 0x10<host>` });
        output({ text: `      loop  txqueuelen 1000  (Local Loopback)` });
      }
    }
  ]);
}
