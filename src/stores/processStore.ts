import { atom } from 'nanostores';

export type AppName = 'nano' | 'htop' | 'snake' | 'calc' | null;

export interface AppProcess {
  name: AppName;
  args: string[];
}

export const $activeApp = atom<AppProcess | null>(null);

export function openApp(name: AppName, args: string[] = []) {
  $activeApp.set({ name, args });
}

export function closeApp() {
  $activeApp.set(null);
}
