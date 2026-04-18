import React, { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $terminalOutput } from '../stores/terminalStore';

export default function TerminalOutput() {
  const output = useStore($terminalOutput);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-output" ref={scrollRef}>
      {output.map((line) => (
        <div key={line.id} className={`output-line ${line.className || ''}`}>
          {line.isHTML ? (
            <span dangerouslySetInnerHTML={{ __html: line.text }} />
          ) : (
            <span className="terminal-text">{line.text}</span>
          )}
        </div>
      ))}
    </div>
  );
}
