import { registerCommands } from '../commandRegistry';
import { $theme, $fontSize, $crtEffects, type ThemeName } from '../../stores/settingsStore';

export function registerSettingsCommands() {
  registerCommands([
    {
      name: 'theme',
      description: 'Change the terminal color theme',
      usage: 'theme <green|amber|blue|white>',
      execute: ({ parsed, output }) => {
        if (parsed.args.length === 0) {
          const current = $theme.get();
          output({ text: `Current theme: ${current}` });
          output({ text: `Available themes: green, amber, blue, white` });
          return;
        }

        const newTheme = parsed.args[0] as ThemeName;
        if (['green', 'amber', 'blue', 'white'].includes(newTheme)) {
          $theme.set(newTheme);
          output({ text: `Theme changed to ${newTheme}` });
        } else {
          output({ text: `theme: invalid theme '${newTheme}'`, className: 'error' });
        }
      }
    },
    {
      name: 'fontsize',
      description: 'Adjust the terminal font size',
      usage: 'fontsize <size_in_px>',
      execute: ({ parsed, output }) => {
         if (parsed.args.length === 0) {
          output({ text: `Current font size: ${$fontSize.get()}px` });
          return;
        }
        
        const size = parseInt(parsed.args[0], 10);
        if (isNaN(size) || size < 8 || size > 72) {
          output({ text: `fontsize: invalid size. Please provide a number between 8 and 72.`, className: 'error' });
        } else {
          $fontSize.set(size);
          output({ text: `Font size changed to ${size}px` });
        }
      }
    },
    {
      name: 'effects',
      description: 'Toggle CRT visual effects and scanlines',
      usage: 'effects [on|off]',
      execute: ({ parsed, output }) => {
        if (parsed.args.length === 0) {
          output({ text: `CRT effects are currently: ${$crtEffects.get() ? 'ON' : 'OFF'}` });
          return;
        }
        
        const opt = parsed.args[0].toLowerCase();
        if (opt === 'on') {
          $crtEffects.set(true);
          output({ text: `CRT effects enabled.` });
        } else if (opt === 'off') {
          $crtEffects.set(false);
          output({ text: `CRT effects disabled.` });
        } else {
          output({ text: `effects: invalid argument. Use 'on' or 'off'.`, className: 'error' });
        }
      }
    }
  ]);
}
