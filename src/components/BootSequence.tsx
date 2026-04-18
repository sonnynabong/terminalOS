import React, { useState, useEffect } from 'react';
import { playBootChime } from '../core/audio';

const BOOT_LINES = [
  { text: '[  OK  ] Initializing kernel...', delay: 400, type: 'ok' },
  { text: '[  OK  ] Loading virtual filesystem...', delay: 800, type: 'ok' },
  { text: '[  OK  ] Mounting /home/user...', delay: 1200, type: 'ok' },
  { text: '[  OK  ] Starting process manager...', delay: 1500, type: 'ok' },
  { text: '[  OK  ] Loading command registry (42 commands)...', delay: 1800, type: 'ok' },
  { text: '[  OK  ] Applying CRT shader effects...', delay: 2200, type: 'ok' },
  { text: '[  OK  ] Network interfaces configured.', delay: 2500, type: 'ok' },
  { text: '[ INFO ] Type \'help\' to get started.', delay: 3000, type: 'info' }
];

const LOGO = `
╔══════════════════════════════════════════════╗
║                                              ║
║   ████████╗███████╗██████╗ ███╗   ███╗       ║
║   ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║       ║
║      ██║   █████╗  ██████╔╝██╔████╔██║       ║
║      ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║       ║
║      ██║   ███████╗██║  ██║██║ ╚═╝ ██║       ║
║      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝       ║
║                  O  S  v1.0                  ║
║                                              ║
╚══════════════════════════════════════════════╝
`;

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [logoRendered, setLogoRendered] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  
  useEffect(() => {
    playBootChime();
    
    // Reveal logo
    setTimeout(() => setLogoRendered(true), 100);

    // Sequence lines
    BOOT_LINES.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
        // Scroll bottom might be needed if lines exceed height, but hard fixed for MVP boot
      }, line.delay);
    });

    // Complete boot
    const totalDelay = BOOT_LINES[BOOT_LINES.length - 1].delay + 500;
    setTimeout(() => {
      onComplete();
    }, totalDelay);
  }, [onComplete]);

  return (
    <div className="boot-sequence crt-power-on terminal-text">
      <div className={`ascii-logo ${logoRendered ? 'visible' : ''}`}>
        {LOGO}
      </div>
      
      {BOOT_LINES.map((line, index) => (
        <div key={index} className={`boot-line ${visibleLines.includes(index) ? 'visible' : ''}`}>
          {/* Quick static parser for badge colors for MVP */}
          {line.text.startsWith('[') ? (
            <>
              [<span className={`badge ${line.type}`}>{(line.text.match(/\[(.*?)\]/)||['',''])[1]}</span>]
              {line.text.substring(line.text.indexOf(']') + 1)}
            </>
          ) : (
             line.text
          )}
        </div>
      ))}
    </div>
  );
}
