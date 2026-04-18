import React, { useState } from 'react';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';
import { addOutputLine } from '../stores/terminalStore';

export default function Terminal() {
  const [promptStr] = useState('user@terminalOS:~$');
  const [isActive, setIsActive] = useState(true);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Phase 1 just echo a placeholder. Phase 2 will plug into commandRegistry
    if (trimmedCmd === 'help') {
      addOutputLine({ text: 'TerminalOS v1.0' });
      addOutputLine({ text: 'Available commands placeholder.' });
    } else {
      addOutputLine({ text: `command not found: ${trimmedCmd}`, className: 'error' });
    }
  };

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
