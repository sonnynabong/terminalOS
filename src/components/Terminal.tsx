import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import { addOutputLine, clearOutput } from '../stores/terminalStore';
import { $cwd } from '../stores/filesystemStore';
import { initTerminalOS } from '../core/init';
import { parseCommand } from '../core/commandParser';
import { getCommand } from '../core/commandRegistry';

export default function Terminal() {
  const cwd = useStore($cwd);
  const [promptStr, setPromptStr] = useState(`user@terminalOS:~#`);
  const [isActive, setIsActive] = useState(true);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Phase 1 fast boot. Phase 3 will replace this with BootSequence component
    initTerminalOS().then(() => {
      setBooted(true);
      addOutputLine({ text: 'Welcome to TerminalOS! Type "help" to start.' });
    });
  }, []);

  useEffect(() => {
    // Dynamic prompt based on cwd
    const displayPath = cwd === '/home/user' ? '~' : cwd;
    setPromptStr(`user@terminalOS:${displayPath}$`);
  }, [cwd]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const parsed = parseCommand(trimmedCmd);
    const commandDef = getCommand(parsed.name);

    if (commandDef) {
       try {
         await commandDef.execute({
           parsed,
           output: addOutputLine,
           clear: clearOutput
         });
       } catch (err: any) {
         addOutputLine({ text: `error executing ${parsed.name}: ${err.message}`, className: 'error' });
       }
    } else {
      addOutputLine({ text: `command not found: ${parsed.name}`, className: 'error' });
    }
  };

  if (!booted) return null;

  return (
    <div 
      className="terminal-container"
      onClick={() => setIsActive(true)}
    >
      <div className="terminal-screen" onClick={(e) => e.stopPropagation()}>
        <TerminalOutput />
        <TerminalInput 
          promptStr={promptStr} 
          onSubmit={handleCommand} 
          isActive={isActive} 
        />
      </div>
    </div>
  );
}
