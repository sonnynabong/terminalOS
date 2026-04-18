import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $currentInput, $commandHistory, $historyIndex, addOutputLine } from '../stores/terminalStore';

interface TerminalInputProps {
  promptStr: string;
  onSubmit: (cmd: string) => void;
  isActive: boolean;
}

export default function TerminalInput({ promptStr, onSubmit, isActive }: TerminalInputProps) {
  const inputStoreValue = useStore($currentInput);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState(0);

  // Keep focus on input when clicking anywhere in the terminal (handled in parent or here)
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    $currentInput.set(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const history = $commandHistory.get();
    let idx = $historyIndex.get();

    if (e.key === 'Enter') {
      const cmd = $currentInput.get();
      addOutputLine({ text: `${promptStr} ${cmd}` });
      if (cmd.trim()) {
        $commandHistory.set([...history, cmd]);
      }
      $historyIndex.set(-1);
      onSubmit(cmd);
      $currentInput.set('');
      setCursorPos(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && idx < history.length - 1) {
        idx++;
        $historyIndex.set(idx);
        $currentInput.set(history[history.length - 1 - idx]);
        setCursorPos(history[history.length - 1 - idx].length);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx > 0) {
        idx--;
        $historyIndex.set(idx);
        $currentInput.set(history[history.length - 1 - idx]);
        setCursorPos(history[history.length - 1 - idx].length);
      } else if (idx === 0) {
        $historyIndex.set(-1);
        $currentInput.set('');
        setCursorPos(0);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic autocomplete for commands phase 1.
      // E.g., 'he' -> 'help'
      const input = $currentInput.get();
      import('../core/commandRegistry').then(({ getAllCommands }) => {
        const cmds = getAllCommands().map(c => c.name);
        const matches = cmds.filter(c => c.startsWith(input));
        if (matches.length === 1) {
          $currentInput.set(matches[0] + ' ');
          setCursorPos(matches[0].length + 1);
        } else if (matches.length > 1) {
          addOutputLine({ text: `${promptStr} ${input}` });
          addOutputLine({ text: matches.join('  ') });
        }
      });
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setCursorPos(e.currentTarget.selectionStart || 0);
  };

  return (
    <div className="terminal-input-row" onClick={() => inputRef.current?.focus()}>
      <span className="prompt terminal-text">{promptStr}</span>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={inputStoreValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          autoComplete="off"
          spellCheck="false"
          autoFocus={isActive}
        />
        {/* Visual layer for text and cursor */}
        <div className="input-display terminal-text">
          {inputStoreValue.split('').map((char, i) => (
            <span key={i} className="input-char">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
          {/* We position the cursor absolutely based on characters. Basic approach: */}
          <span 
            className="cursor" 
            style={{ 
              transform: `translateX(calc(${cursorPos} * 0.6em))` 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
