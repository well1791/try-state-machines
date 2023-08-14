import { useState, useEffect } from 'react'

import * as t from '@/data/editorKeymaps'

const defaultPos = { row: 0, col: 0 }

export default function useKeyListener() {
  const [editor, setEditor] = useState<t.EditorInfo>({
    mode: t.editorMode.normal,
    buffer: [''],
    position: { current: defaultPos, previous: defaultPos },
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      e.preventDefault()
      const usableKey = {
        mod: e.shiftKey ? [t.modKeys.shift] : [],
        key: e.key,
      }
      const keyname = [
        ...usableKey.mod,
        usableKey.key.toLowerCase(),
      ].join(' ')
      const editorAction = t.keymap[editor.mode][keyname]
        ?? (() => {})
        ?? (() => {})
      editorAction(editor, setEditor, usableKey)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [editor])

  return {
    editor,
    keymap: t.keymap[editor.mode],
  }
}
