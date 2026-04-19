import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $crtEffects } from '../stores/settingsStore';

export default function CRTOverlay() {
  const effectsEnabled = useStore($crtEffects);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted || !effectsEnabled) return null;

  return (
    <>
      <div className="crt-scanlines"></div>
      <div className="crt-vignette"></div>
      <div className="crt-flicker"></div>
      <div className="crt-scan-line"></div>
    </>
  );
}
