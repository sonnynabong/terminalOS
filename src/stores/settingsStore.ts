import { atom, onSet } from 'nanostores';
import { get, set } from 'idb-keyval';

export type ThemeName = 'green' | 'amber' | 'blue' | 'white';

export const $theme = atom<ThemeName>('green');
export const $fontSize = atom<number>(16);
export const $crtEffects = atom<boolean>(true);
export const $soundEnabled = atom<boolean>(false);

let initialized = false;

export async function initSettings() {
  if (initialized) return;
  try {
    const settings = await get('terminalOS_settings');
    if (settings) {
      if (settings.theme) $theme.set(settings.theme);
      if (settings.fontSize) $fontSize.set(settings.fontSize);
      if (settings.crtEffects !== undefined) $crtEffects.set(settings.crtEffects);
      if (settings.soundEnabled !== undefined) $soundEnabled.set(settings.soundEnabled);
    }
  } catch(e) {
    console.error('Failed to load settings', e);
  }
  
  // Apply initial sizes and themes
  document.body.dataset.theme = $theme.get();
  document.documentElement.style.setProperty('--font-size', `${$fontSize.get()}px`);
  
  initialized = true;
}

function saveSettings() {
  if (!initialized) return;
  set('terminalOS_settings', {
    theme: $theme.get(),
    fontSize: $fontSize.get(),
    crtEffects: $crtEffects.get(),
    soundEnabled: $soundEnabled.get()
  }).catch(e => console.error('Failed to save settings', e));
}

onSet($theme, ({ newValue }) => {
  document.body.dataset.theme = newValue;
  saveSettings();
});

onSet($fontSize, ({ newValue }) => {
  document.documentElement.style.setProperty('--font-size', `${newValue}px`);
  saveSettings();
});

onSet($crtEffects, () => saveSettings());
onSet($soundEnabled, () => saveSettings());
