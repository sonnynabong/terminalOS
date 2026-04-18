import type { ParsedCommand } from './commandParser';
import type { OutputLine } from '../stores/terminalStore';

export interface CommandContext {
  parsed: ParsedCommand;
  output: (line: Omit<OutputLine, 'id'>) => void;
  clear: () => void;
  // Further context like filesystem state will be accessed via nanostores directly in commands
}

export type CommandFn = (ctx: CommandContext) => void | Promise<void>;

export interface CommandDefinition {
  name: string;
  description: string;
  usage: string;
  execute: CommandFn;
}

const commands = new Map<string, CommandDefinition>();

export function registerCommand(def: CommandDefinition) {
  commands.set(def.name, def);
}

export function registerCommands(defs: CommandDefinition[]) {
  defs.forEach(registerCommand);
}

export function getCommand(name: string): CommandDefinition | undefined {
  return commands.get(name);
}

export function getAllCommands(): CommandDefinition[] {
  return Array.from(commands.values()).sort((a, b) => a.name.localeCompare(b.name));
}
