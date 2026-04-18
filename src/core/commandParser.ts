export interface ParsedCommand {
  name: string;
  args: string[];
  flags: Record<string, string | boolean>;
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { name: '', args: [], flags: {}, raw: input };
  }

  // Handle basic quotes
  const parts = [];
  let currentWord = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    
    if ((char === '"' || char === "'") && (i === 0 || trimmed[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      } else {
        currentWord += char;
      }
    } else if (char === ' ' && !inQuotes) {
      if (currentWord) {
        parts.push(currentWord);
        currentWord = '';
      }
    } else {
      currentWord += char;
    }
  }
  
  if (currentWord) {
    parts.push(currentWord);
  }

  const name = parts[0];
  const rawArgs = parts.slice(1);
  
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    
    if (arg.startsWith('--')) {
      const parts = arg.substring(2).split('=');
      if (parts.length > 1) {
        flags[parts[0]] = parts.slice(1).join('=');
      } else {
        flags[parts[0]] = true;
      }
    } else if (arg.startsWith('-') && arg !== '-') {
      for (let j = 1; j < arg.length; j++) {
        flags[arg[j]] = true;
      }
    } else {
      args.push(arg);
    }
  }

  return { name, args, flags, raw: input };
}
