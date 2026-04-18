import { registerFilesystemCommands } from './commands/filesystem';
import { registerSystemCommands } from './commands/system';
import { registerFunCommands } from './commands/fun';
import { registerSettingsCommands } from './commands/settings';
import { initFilesystem } from '../stores/filesystemStore';
import { initSettings } from '../stores/settingsStore';

let initialized = false;

export async function initTerminalOS() {
  if (initialized) return;
  
  await initSettings();
  await initFilesystem();
  registerFilesystemCommands();
  registerSystemCommands();
  registerFunCommands();
  registerSettingsCommands();
  
  initialized = true;
}
