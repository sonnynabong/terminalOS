import { atom, onSet } from 'nanostores';
import { get, set } from 'idb-keyval';
import { defaultFilesystem, type FSNode } from '../core/filesystem';

const FS_STORAGE_KEY = 'terminalOS_fs';

// CWD does not strictly need idb persistence but can be nice
export const $cwd = atom<string>('/home/user');
export const $fsRoot = atom<FSNode[]>(defaultFilesystem);

let initialized = false;

// Initialize from idb once
export async function initFilesystem() {
  if (initialized) return;
  try {
    const saved = await get(FS_STORAGE_KEY);
    if (saved) {
      $fsRoot.set(saved);
    }
  } catch (e) {
    console.error('Failed to load filesystem from idb', e);
  }
  initialized = true;
}

// Persist on change
onSet($fsRoot, ({ newValue }) => {
  if (initialized) {
    set(FS_STORAGE_KEY, newValue).catch(e => console.error('Failed to save fs', e));
  }
});
