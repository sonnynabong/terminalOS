export type FSNodeType = 'file' | 'directory';

export interface FSNode {
  name: string;
  type: FSNodeType;
  content?: string;
  children?: FSNode[];
  permissions: string;
  owner: string;
  createdAt: number;
  modifiedAt: number;
  size: number;
}

export const defaultFilesystem: FSNode[] = [
  {
    name: 'home',
    type: 'directory',
    permissions: 'rwxr-xr-x',
    owner: 'root',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    size: 4096,
    children: [
      {
        name: 'user',
        type: 'directory',
        permissions: 'rwxr-xr-x',
        owner: 'user',
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        size: 4096,
        children: [
          {
            name: 'documents',
            type: 'directory',
            permissions: 'rwxr-xr-x',
            owner: 'user',
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            size: 4096,
            children: [
              {
                name: 'readme.txt',
                type: 'file',
                content: 'Welcome to TerminalOS!\n\nThis is a fully functional web-based terminal simulator.\nType "help" to see available commands.',
                permissions: 'rw-r--r--',
                owner: 'user',
                createdAt: Date.now(),
                modifiedAt: Date.now(),
                size: 156
              }
            ]
          },
          {
            name: 'bin',
            type: 'directory',
            permissions: 'rwxr-xr-x',
            owner: 'user',
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            size: 4096,
            children: []
          }
        ]
      }
    ]
  },
  {
    name: 'var',
    type: 'directory',
    permissions: 'rwxr-xr-x',
    owner: 'root',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    size: 4096,
    children: [
      {
        name: 'log',
        type: 'directory',
        permissions: 'rwxr-xr-x',
        owner: 'root',
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        size: 4096,
        children: [
          {
            name: 'boot.log',
            type: 'file',
            content: '[ OK ] Kernel loaded.\n[ OK ] Filesystem mounted.',
            permissions: 'rw-r--r--',
            owner: 'root',
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            size: 50
          }
        ]
      }
    ]
  }
];

export function resolvePath(cwd: string, targetedPath: string): string {
  if (targetedPath.startsWith('/')) {
    return normalizePath(targetedPath);
  }
  return normalizePath(`${cwd}/${targetedPath}`);
}

export function normalizePath(p: string): string {
  const parts = p.split('/').filter(Boolean);
  const resolved: string[] = [];
  
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  
  return '/' + resolved.join('/');
}

// Navigates the tree to return a node at the absolute path
export function getNodeAtPath(rootNodes: FSNode[], absolutePath: string): FSNode | null {
  if (absolutePath === '/') {
    return {
      name: '/',
      type: 'directory',
      children: rootNodes,
      permissions: 'rwxr-xr-x',
      owner: 'root',
      createdAt: 0,
      modifiedAt: 0,
      size: 4096
    };
  }

  const parts = absolutePath.split('/').filter(Boolean);
  let currentList = rootNodes;
  let targetNode: FSNode | null = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const found = currentList.find(n => n.name === part);
    if (!found) return null;

    if (i === parts.length - 1) {
      targetNode = found;
    } else {
      if (found.type !== 'directory') return null;
      currentList = found.children || [];
    }
  }

  return targetNode;
}
