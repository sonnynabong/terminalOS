import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $currentInput, addOutputLine } from '../stores/terminalStore';

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
    if (e.key === 'Enter') {
      const cmd = $currentInput.get();
      // Echo the command
      addOutputLine({ text: `${promptStr} ${cmd}` });
      onSubmit(cmd);
      $currentInput.set('');
      setCursorPos(0);
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
