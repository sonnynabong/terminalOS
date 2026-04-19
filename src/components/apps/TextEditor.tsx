import React, { useState, useEffect, useRef } from 'react';
import { closeApp } from '../../stores/processStore';
import { $fsRoot, $cwd } from '../../stores/filesystemStore';
import { resolvePath, getNodeAtPath } from '../../core/filesystem';

interface TextEditorProps {
  args: string[];
}

export default function TextEditor({ args }: TextEditorProps) {
  const [content, setContent] = useState('');
  const [filename] = useState(args[0] || 'Untitled');
  const [status, setStatus] = useState('New Buffer');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (args.length > 0) {
      const target = args[0];
      const absPath = resolvePath($cwd.get(), target);
      const node = getNodeAtPath($fsRoot.get(), absPath);
      
      if (node && node.type === 'file') {
        setContent(node.content || '');
        setStatus(`Read ${node.content?.split('\n').length || 0} lines`);
      } else if (node && node.type === 'directory') {
        setStatus(`Error: ${target} is a directory`);
      } else {
        setStatus(`New file`);
      }
    }
    textareaRef.current?.focus();
  }, [args]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey) {
      if (e.key === 'x') {
        e.preventDefault();
        closeApp();
      } else if (e.key === 'o') {
        e.preventDefault();
        saveFile();
      }
    }
  };

  const saveFile = () => {
    if (!filename || filename === 'Untitled') {
      setStatus('Cannot save Untitled buffer. Please open with a filename.');
      return;
    }

    const absPath = resolvePath($cwd.get(), filename);
    const parts = absPath.split('/');
    const newFileName = parts.pop()!;
    const parentPath = parts.join('/') || '/';
    
    const root = $fsRoot.get();
    const parentNode = getNodeAtPath(root, parentPath);
    
    if (!parentNode || parentNode.type !== 'directory') {
      setStatus('Error: Parent directory does not exist.');
      return;
    }

    let node = (parentNode.children || []).find(c => c.name === newFileName);
    if (node) {
      if (node.type === 'directory') {
        setStatus(`Error: ${filename} is a directory.`);
        return;
      }
      node.content = content;
      node.modifiedAt = Date.now();
      node.size = content.length;
    } else {
      node = {
        name: newFileName,
        type: 'file',
        content,
        permissions: 'rw-r--r--',
        owner: 'user',
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        size: content.length
      };
      parentNode.children = [...(parentNode.children || []), node];
    }
    
    $fsRoot.set([...root]);
    setStatus(`Wrote ${content.split('\n').length} lines`);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <span>GNU nano 7.2</span>
        <span>{filename}</span>
        <span></span>
      </div>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="app-content terminal-text"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          whiteSpace: 'pre-wrap'
        }}
        spellCheck="false"
      />
      
      <div className="app-footer" style={{flexDirection: 'column'}}>
        <div style={{textAlign: 'center', marginBottom: '4px'}}>{status}</div>
        <div style={{display: 'flex', gap: '16px'}}>
          <span>^X Exit</span>
          <span>^O Write Out</span>
        </div>
      </div>
    </div>
  );
}
