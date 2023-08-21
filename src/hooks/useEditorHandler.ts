import { useState, useEffect } from 'react'

import * as t from '@/data/editorKeymaps'

const defaultPos = { row: 0, col: 0 }

export default function useEditorHandler() {
  const [editor, setEditor] = useState<t.EditorInfo>({
    mode: t.editorMode.normal,
    buffer: [''],
    position: { current: defaultPos, previous: defaultPos },
    undoRedo: [[], []],
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      e.preventDefault()
      const usableKey = {
        mod: e.shiftKey ? [t.modKey.shift] : [],
        key: e.key,
      }
      const keyname = [
        ...usableKey.mod,
        usableKey.key.toLowerCase(),
      ].join(' ') // ex: a | shift k | 8 | shift *
      const editorAction = t.keymap[editor.mode][keyname]
        ?? t.keymapPattern[editor.mode].find((p) => p.pattern.test(e.key))?.action
        ?? (() => {})
      editorAction(editor, setEditor, usableKey)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [editor])

  return {
    ...editor,
    keymap: t.keymap[editor.mode],
  }
}
