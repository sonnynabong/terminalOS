import { registerCommands } from '../commandRegistry';
import { $fsRoot, $cwd } from '../../stores/filesystemStore';
import { resolvePath, getNodeAtPath, type FSNode } from '../filesystem';

export function registerFilesystemCommands() {
  registerCommands([
    {
      name: 'pwd',
      description: 'Print working directory',
      usage: 'pwd',
      execute: ({ output }) => {
        output({ text: $cwd.get() });
      }
    },
    {
      name: 'ls',
      description: 'List directory contents',
      usage: 'ls [dir]',
      execute: ({ parsed, output }) => {
        const cwd = $cwd.get();
        const target = parsed.args[0] || '.';
        const absPath = resolvePath(cwd, target);
        const node = getNodeAtPath($fsRoot.get(), absPath);

        if (!node) {
          output({ text: `ls: cannot access '${target}': No such file or directory`, className: 'error' });
          return;
        }

        if (node.type === 'file') {
          output({ text: node.name });
          return;
        }

        const children = node.children || [];
        if (children.length === 0) return;

        // Simple listing for now
        const names = children.map(c => c.type === 'directory' ? `<span style="color: #00D4FF">${c.name}/</span>` : c.name);
        
        output({ 
          text: `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;">${names.join('')}</div>`, 
          isHTML: true 
        });
      }
    },
    {
      name: 'cd',
      description: 'Change directory',
      usage: 'cd [dir]',
      execute: ({ parsed, output }) => {
        const target = parsed.args[0] || '/home/user';
        const absPath = resolvePath($cwd.get(), target);
        
        const node = getNodeAtPath($fsRoot.get(), absPath);
        if (!node) {
          output({ text: `cd: ${target}: No such file or directory`, className: 'error' });
        } else if (node.type === 'file') {
          output({ text: `cd: ${target}: Not a directory`, className: 'error' });
        } else {
          $cwd.set(absPath);
        }
      }
    },
    {
      name: 'cat',
      description: 'Concatenate files and print on the standard output',
      usage: 'cat <file>',
      execute: ({ parsed, output }) => {
        if (!parsed.args.length) {
          output({ text: `cat: missing operand`, className: 'error' });
          return;
        }
        
        const target = parsed.args[0];
        const absPath = resolvePath($cwd.get(), target);
        const node = getNodeAtPath($fsRoot.get(), absPath);
        
        if (!node) {
          output({ text: `cat: ${target}: No such file or directory`, className: 'error' });
        } else if (node.type === 'directory') {
          output({ text: `cat: ${target}: Is a directory`, className: 'error' });
        } else {
          const lines = (node.content || '').split('\n');
          lines.forEach(text => output({ text }));
        }
      }
    },
    {
      name: 'mkdir',
      description: 'Make directories',
      usage: 'mkdir <dir>',
      execute: ({ parsed, output }) => {
        if (!parsed.args.length) {
          output({ text: `mkdir: missing operand`, className: 'error' });
          return;
        }
        
        const target = parsed.args[0];
        const absPath = resolvePath($cwd.get(), target);
        
        // Ensure parent exists
        const parts = absPath.split('/');
        const newDirName = parts.pop()!;
        const parentPath = parts.join('/') || '/';
        
        const parentNode = getNodeAtPath($fsRoot.get(), parentPath);
        
        if (!parentNode) {
          output({ text: `mkdir: cannot create directory '${target}': No such file or directory`, className: 'error' });
          return;
        }
        if (parentNode.type !== 'directory') {
          output({ text: `mkdir: cannot create directory '${target}': Not a directory`, className: 'error' });
          return;
        }
        
        if ((parentNode.children || []).find(c => c.name === newDirName)) {
          output({ text: `mkdir: cannot create directory '${target}': File exists`, className: 'error' });
          return;
        }
        
        const newDir: FSNode = {
          name: newDirName,
          type: 'directory',
          children: [],
          permissions: 'rwxr-xr-x',
          owner: 'user',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          size: 4096
        };
        
        parentNode.children = [...(parentNode.children || []), newDir];
        // Trigger nanostores update via destructuring
        $fsRoot.set([...$fsRoot.get()]);
      }
    },
    {
      name: 'touch',
      description: 'Change file timestamps (creates empty file)',
      usage: 'touch <file>',
      execute: ({parsed, output}) => {
         if (!parsed.args.length) {
          output({ text: `touch: missing file operand`, className: 'error' });
          return;
        }
        
        const target = parsed.args[0];
        const absPath = resolvePath($cwd.get(), target);
        
        const node = getNodeAtPath($fsRoot.get(), absPath);
        if (node) {
          node.modifiedAt = Date.now();
          $fsRoot.set([...$fsRoot.get()]);
          return;
        }

        const parts = absPath.split('/');
        const newFileName = parts.pop()!;
        const parentPath = parts.join('/') || '/';
        const parentNode = getNodeAtPath($fsRoot.get(), parentPath);

        if (!parentNode || parentNode.type !== 'directory') {
          output({ text: `touch: cannot touch '${target}': No such file or directory`, className: 'error' });
          return;
        }

        const newFile: FSNode = {
          name: newFileName,
          type: 'file',
          content: '',
          permissions: 'rw-r--r--',
          owner: 'user',
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          size: 0
        };

        parentNode.children = [...(parentNode.children || []), newFile];
        $fsRoot.set([...$fsRoot.get()]);
      }
    },
    {
      name: 'rm',
      description: 'Remove files or directories',
      usage: 'rm <path>',
      execute: ({ parsed, output }) => {
        if (!parsed.args.length) {
          output({ text: `rm: missing operand`, className: 'error' });
          return;
        }
        const target = parsed.args[0];
        const absPath = resolvePath($cwd.get(), target);
        
        if (absPath === '/') {
          output({ text: `rm: it is dangerous to operate recursively on '/'`, className: 'error' });
          return;
        }

        const parts = absPath.split('/');
        const targetName = parts.pop()!;
        const parentPath = parts.join('/') || '/';
        const parentNode = getNodeAtPath($fsRoot.get(), parentPath);

        if (!parentNode || parentNode.type !== 'directory') {
          output({ text: `rm: cannot remove '${target}': No such file or directory`, className: 'error' });
          return;
        }

        const idx = (parentNode.children || []).findIndex(c => c.name === targetName);
        if (idx === -1) {
          output({ text: `rm: cannot remove '${target}': No such file or directory`, className: 'error' });
          return;
        }

        parentNode.children?.splice(idx, 1);
        $fsRoot.set([...$fsRoot.get()]);
      }
    },
    {
      name: 'tree',
      description: 'List contents of directories in a tree-like format',
      usage: 'tree [dir]',
      execute: ({ parsed, output }) => {
        const target = parsed.args[0] || '.';
        const absPath = resolvePath($cwd.get(), target);
        const startNode = getNodeAtPath($fsRoot.get(), absPath);

        if (!startNode || startNode.type !== 'directory') {
           output({ text: `tree: ${target}: No such directory`, className: 'error' });
           return;
        }

        let dirCount = 0;
        let fileCount = 0;

        const printTree = (node: FSNode, prefix: string = '') => {
          const children = node.children || [];
          children.forEach((child, index) => {
            const isLast = index === children.length - 1;
            const pointer = isLast ? '└── ' : '├── ';
            
            if (child.type === 'directory') {
              dirCount++;
              output({ text: `${prefix}${pointer}<span style="color: #00D4FF">${child.name}</span>`, isHTML: true });
              printTree(child, prefix + (isLast ? '    ' : '│   '));
            } else {
              fileCount++;
              output({ text: `${prefix}${pointer}${child.name}` });
            }
          });
        };

        output({ text: `<span style="color: #00D4FF">${startNode.name === '/' ? '.' : startNode.name}</span>`, isHTML: true });
        printTree(startNode);
        output({ text: `\n${dirCount} directories, ${fileCount} files` });
      }
    }
  ]);
}
