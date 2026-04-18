import { atom } from 'nanostores';

export type OutputLine = {
  id: string;
  text: string;
  isHTML?: boolean;
  className?: string; // e.g., 'system', 'error', 'user-input'
};

export const $terminalOutput = atom<OutputLine[]>([]);
export const $currentInput = atom<string>('');
export const $commandHistory = atom<string[]>([]);
export const $historyIndex = atom<number>(-1);

// Add a line to the output
export function addOutputLine(line: Omit<OutputLine, 'id'>) {
  $terminalOutput.set([
    ...$terminalOutput.get(),
    { ...line, id: Math.random().toString(36).substring(2, 9) }
  ]);
}

// Clear output
export function clearOutput() {
  $terminalOutput.set([]);
}
