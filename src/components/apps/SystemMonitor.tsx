import { useEffect, useState } from 'react';
import { closeApp } from '../../stores/processStore';

export default function SystemMonitor() {
  const [cpu, setCpu] = useState([10, 5, 20, 8]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || (e.ctrlKey && e.key === 'c')) {
        closeApp();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      setCpu(prev => prev.map(() => Math.floor(Math.random() * 100)));
      setTimer(t => t + 1);
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const renderBar = (val: number, label: string) => {
    const count = Math.floor(val / 2);
    const bars = '|'.repeat(count).padEnd(50, ' ');
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <span style={{ width: '40px' }}>{label}</span>
        <span>[{bars}] {val.toString().padStart(3, ' ')}%</span>
      </div>
    );
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#000', color: '#00D4FF', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          {cpu.map((c, i) => renderBar(c, (i+1).toString()))}
          {renderBar(45, 'Mem')}
          {renderBar(2, 'Swp')}
        </div>
        <div>
          <div>Tasks: 42, 1 thr; 1 running</div>
          <div>Load average: 0.23, 0.45, 0.38</div>
          <div>Uptime: 00:0{timer}:00</div>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#fff', color: '#000', fontWeight: 'bold', padding: '0 8px' }}>
        PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command
      </div>
      <div style={{ padding: '0 8px' }}>
         1 root       20   0 225M   13M  9.1M S  0.0  0.1  0:03.20 /sbin/init
        42 user       20   0 1.2G  150M   80M S  2.4  1.8  0:10.50 react-dom
        43 user       20   0  15M  2.1M  1.0M R  0.5  0.0  0:00.10 htop
      </div>

      <div className="app-footer" style={{ marginTop: 'auto', backgroundColor: '#00D4FF', color: '#000' }}>
        <span>F1Help  F2Setup  F3Search  F4Filter  F5Tree  F6SortBy  F7Nice-  F8Nice+  F9Kill  F10Quit</span>
      </div>
    </div>
  );
}
