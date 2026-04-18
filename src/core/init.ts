import { registerFilesystemCommands } from './commands/filesystem';
import { registerSystemCommands } from './commands/system';
import { initFilesystem } from '../stores/filesystemStore';

let initialized = false;

export async function initTerminalOS() {
  if (initialized) return;
  
  await initFilesystem();
  registerFilesystemCommands();
  registerSystemCommands();
  
  initialized = true;
}
