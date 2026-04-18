import React, { useState, useEffect } from 'react';
import { closeApp } from '../../stores/processStore';

export default function Calculator() {
  const [expr, setExpr] = useState('');
  const [history, setHistory] = useState<{e: string, r: string}[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || (e.ctrlKey && e.key === 'c') || e.key === 'Escape') {
        closeApp();
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEval = () => {
    if (!expr) return;
    try {
      // Basic safe eval using Function inside calculator scope
      // Not suitable for untrusted arbitrary JS execution but fine for simple math in this context
      // Alternatively could parse the math expression.
      const result = new Function(`return ${expr}`)();
      setHistory(prev => [...prev.slice(-9), { e: expr, r: String(result) }]);
      setExpr('');
    } catch {
      setHistory(prev => [...prev.slice(-9), { e: expr, r: 'Error' }]);
      setExpr('');
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEval();
  };

  return (
    <div className="app-container" style={{ alignItems: 'flex-start', padding: 16 }}>
      <div className="app-header" style={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
        <span>CALCULATOR</span>
        <span>Esc/Q to Quit</span>
      </div>
      
      <div style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
        {history.map((item, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{item.e}</div>
            <div style={{ fontSize: '1.2em' }}>= {item.r}</div>
          </div>
        ))}
        
        <div style={{ display: 'flex', marginTop: '1rem', borderBottom: '1px solid currentColor' }}>
          <span style={{ marginRight: '8px', fontSize: '1.2em' }}>&gt;</span>
          <input 
            autoFocus
            type="text" 
            value={expr}
            onChange={e => setExpr(e.target.value)}
            onKeyDown={handleKeyDownInput}
            style={{ 
              background: 'transparent', border: 'none', color: 'inherit', 
              fontFamily: 'inherit', fontSize: '1.2em', outline: 'none', flex: 1 
            }}
          />
        </div>
      </div>
    </div>
  );
}
