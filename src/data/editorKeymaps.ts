import type * as edKeyT from './editorKeys'
import * as edKey from './editorKeys'

import type * as edActionT from './editorActions'
import * as edAction from './editorActions'

import type * as uT from './utils'
import * as u from './utils'

export * from './editorActions'
export * from './editorKeys'
export * from './utils'

export const editorMode = {
  normal: 'normal',
  insert: 'insert',
} as const

export type EditorMode = keyof typeof editorMode

export type EditorCaretPosition = {
  row: number
  col: number
}

export type UndoRedo = [Array<uT.Buffer>, Array<uT.Buffer>]

export type EditorInfo = {
  mode: EditorMode
  buffer: uT.Buffer
  position: {
    current: EditorCaretPosition
    previous: EditorCaretPosition
  }
  undoRedo: UndoRedo
}

export type UsableKey = {
  mod?: Readonly<Array<edKeyT.ModKeyName>>
  key: edKeyT.UsableKeyValue
}

export type UsableKeys = Readonly<Array<UsableKey>>

export type KeymapData = {
  actionName: edActionT.EditorAction
}

export type EditorInfoUpdater  = (
  editorInfo: EditorInfo,
  editorInfoUpdater: (editorInfo: EditorInfo) => void,
  keyvalue: UsableKey,
) => void

export type KeymapAction = (data: KeymapData) => EditorInfoUpdater

export type KeymapValue = {
  keys?: UsableKeys
  pattern?: RegExp
  action: KeymapAction
}

export type Keymap<T extends edActionT.EditorAction> = { [K in T]: KeymapValue }

export const editAction: Record<edActionT.EditAction, KeymapAction> = {
  [edAction.editAction.inputPrintableKeys]: () => (editor, setEditor, { key }) => {
    const updateCurrentPosition = ({
      position: { current: c },
    }: EditorInfo): EditorCaretPosition => ({ row: c.row, col: c.col + 1 })
    const updateBuffer = ({
      buffer: b,
      position: { current: c, previous: p },
    }: EditorInfo): uT.Buffer => {
      const [left, right] = u.splitStrAt(p.col, b[c.row])
      b[c.row] = left + key + right
      return b
    }

    const position = {
      current: updateCurrentPosition(editor),
      previous: editor.position.current,
    }
    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
    console.log(
      [editor.buffer, ...editor.undoRedo[0]],
      editor.undoRedo[1],
    )

    setEditor({
      ...editor,
      buffer: updateBuffer({ ...editor, position }),
      position,
      undoRedo: [
        [structuredClone(editor.buffer), ...editor.undoRedo[0]],
        editor.undoRedo[1],
      ],
    })
  },

  [edAction.editAction.addOneLineDown]: () => (editor, setEditor) => {
    const updateCurrentPosition = ({
      position: { current: c },
    }: EditorInfo): EditorCaretPosition => ({ row: c.row + 1, col: 0 })
    const updateBuffer = ({
      buffer: b,
      position: { current: c, previous: p }
    }: EditorInfo): uT.Buffer => {
      const [prevL, prevR] = u.splitStrAt(p.col, b[p.row])
      b[p.row] = prevL
      const [top, bot] = [
        b.slice(0, c.row),
        b.slice(c.row),
      ]
      return u.cleanArray(top.concat(prevR, bot))
    }

    const position = {
      current: updateCurrentPosition(editor),
      previous: editor.position.current,
    }
    setEditor({
      ...editor,
      buffer: updateBuffer({ ...editor, position }),
      position,
      undoRedo: [
        [editor.buffer, ...editor.undoRedo[0]],
        editor.undoRedo[1],
      ],
    })
  },

  [edAction.editAction.deleteLeft]: () => (editor, setEditor) => {
    const prev = (n: number) => Math.max(n - 1, 0)
    const updateCurrentPosition = ({
      buffer,
      position: { current },
    }: EditorInfo): EditorCaretPosition => {
      const prevRow = prev(current.row)
      return current.col == 0
        ? { row: prevRow, col: buffer[prevRow].length }
        : { row: current.row, col: prev(current.col) }
    }
    const updateBuffer = ({
      buffer: b,
      position: { current: c, previous: p }
    }: EditorInfo): uT.Buffer => {
      if (c.row == p.row && c.col == p.col) return b;

      const [prevL, prevR] = u.splitStrAt(p.col, b[p.row])
      b[p.row] = prevL.slice(0, -1) + prevR

      if (c.row != p.row) {
        b[c.row] = b[c.row] + b[p.row]
        b = u.concatArr(b.slice(0, p.row), b.slice(p.row + 1))
      }

      return b
    }

    const position = {
      current: updateCurrentPosition(editor),
      previous: editor.position.current,
    }
    setEditor({
      ...editor,
      buffer: updateBuffer({ ...editor, position }),
      position,
      undoRedo: [
        [editor.buffer, ...editor.undoRedo[0]],
        editor.undoRedo[1],
      ],
    })
  },

  [edAction.editAction.undo]: () => (editor, setEditor) => {
    const updateCurrentPosition = ({
      position: { current: c },
      undoRedo: [[lastUndo]],
    }: EditorInfo): EditorCaretPosition => lastUndo ? {
      row: Math.min(c.row, lastUndo.length),
      col: Math.min(c.col, lastUndo[c.row]?.length ?? 0),
    } : c
    const updateBuffer = ({
      buffer: b,
      undoRedo: [[lastUndo]],
    }: EditorInfo): uT.Buffer => lastUndo ?? b
    const updateUndoRedoList = ({
      undoRedo: [[lastUndo, ...restUndo], redoList],
    }: EditorInfo): UndoRedo => ([restUndo, [lastUndo, ...redoList]])

    const position = {
      current: updateCurrentPosition(editor),
      previous: editor.position.current,
    }

    console.table('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
    console.table(position)
    console.log(updateUndoRedoList(editor))
    console.log(editor.undoRedo)
    setEditor({
      ...editor,
      buffer: updateBuffer({ ...editor, position }),
      position,
      undoRedo: updateUndoRedoList(editor),
    })
  },
}

export const navigateAction: Record<edActionT.NavigateAction, KeymapAction> = {
  [edAction.navigateAction.goToInsert]: () => (editor, setEditor) =>
    setEditor({ ...editor, mode: editorMode.insert }),

  [edAction.navigateAction.goToNormal]: () => (editor, setEditor) =>
    setEditor({ ...editor, mode: editorMode.normal }),

  [edAction.navigateAction.moveCaretUp]: () => ({
    buffer: b,
    position: { current: c },
    ...ed
  }, setEditor) => {
    const prevRow = c.row - 1
    const row = Math.max(prevRow, 0)
    const col = Math.min(c.col, b[row].length)
    setEditor({
      ...ed,
      buffer: b,
      position: {
        current: { row, col },
        previous: c,
      }
    })
  },

  [edAction.navigateAction.moveCaretDown]: () => ({
    buffer: b,
    position: { current: c },
    ...ed
  }, setEditor) => {
    const nextRow = c.row + 1
    const row = Math.min(nextRow, b.length - 1)
    const col = Math.min(c.col, b[row].length)
    setEditor({
      ...ed,
      buffer: b,
      position: {
        current: { row, col },
        previous: c,
      }
    })
  },

  [edAction.navigateAction.moveCaretLeft]: () => ({
    buffer: b,
    position: { current: c },
    ...ed
  }, setEditor) => {
    if (c.row == 0 && c.col == 0) return;
    let row = c.row
    let col = c.col - 1
    if (col < 0) {
      row = Math.max(c.row - 1, 0)
      col = b[row].length
    }
    setEditor({
      ...ed,
      buffer: b,
      position: {
        current: { row, col },
        previous: c,
      }
    })
  },

  [edAction.navigateAction.moveCaretRight]: () => ({
    buffer: b,
    position: { current: c },
    ...ed
  }, setEditor) => {
    const lastRow = b.length - 1
    if (c.row == lastRow && c.col == b[lastRow].length) return;

    let row = c.row
    let col = c.col + 1
    if (col > b[c.row].length) {
      row = Math.min(c.row + 1, lastRow)
      col = 0
    }
    setEditor({
      ...ed,
      buffer: b,
      position: {
        current: { row, col },
        previous: c,
      }
    })
  },
}

export const normalKeymap = {
  [edAction.navigateAction.goToInsert]: {
    keys: [{ key: edKey.unshiftedSymbolKey.semicolon }],
    action: navigateAction.goToInsert,
  },
  [edAction.editAction.deleteLeft]: {
    keys: [{ key: edKey.alphaKey.o }],
    action: editAction.deleteLeft,
  },
  [edAction.editAction.undo]: {
    keys: [{ key: edKey.alphaKey.u }],
    action: editAction.undo,
  },
  [edAction.navigateAction.moveCaretUp]: {
    keys: [{ key: edKey.alphaKey.w }, { key: edKey.specialKey.arrowup }],
    action: navigateAction.moveCaretUp,
  },
  [edAction.navigateAction.moveCaretDown]: {
    keys: [{ key: edKey.alphaKey.s }, { key: edKey.specialKey.arrowdown }],
    action: navigateAction.moveCaretDown,
  },
  [edAction.navigateAction.moveCaretLeft]: {
    keys: [{ key: edKey.alphaKey.a }, { key: edKey.specialKey.arrowleft }],
    action: navigateAction.moveCaretLeft,
  },
  [edAction.navigateAction.moveCaretRight]: {
    keys: [{ key: edKey.alphaKey.d }, { key: edKey.specialKey.arrowright }],
    action: navigateAction.moveCaretRight,
  },
} as const

export const insertKeymap = {
  [edAction.navigateAction.goToNormal]: {
    keys: [{ key: edKey.specialKey.escape}],
    action: navigateAction.goToNormal,
  },
  [edAction.editAction.deleteLeft]: {
    keys: [{ key: edKey.specialKey.backspace }],
    action: editAction.deleteLeft,
  },
  [edAction.editAction.addOneLineDown]: {
    keys: [{ key: edKey.specialKey.enter}],
    action: editAction.addOneLineDown,
  },
  [edAction.editAction.inputPrintableKeys]: {
    pattern: new RegExp('^.$'),
    action: editAction.inputPrintableKeys,
  },
  [edAction.navigateAction.moveCaretUp]: {
    keys: [{ key: edKey.specialKey.arrowup }],
    action: navigateAction.moveCaretUp,
  },
  [edAction.navigateAction.moveCaretDown]: {
    keys: [{ key: edKey.specialKey.arrowdown }],
    action: navigateAction.moveCaretDown,
  },
  [edAction.navigateAction.moveCaretLeft]: {
    keys: [{ key: edKey.specialKey.arrowleft }],
    action: navigateAction.moveCaretLeft,
  },
  [edAction.navigateAction.moveCaretRight]: {
    keys: [{ key: edKey.specialKey.arrowright }],
    action: navigateAction.moveCaretRight,
  },
} as const

const flattenToKeymapKeyActions = <T extends edActionT.EditorAction>(
  keymap: Keymap<T>,
) => Object
  .entries<KeymapValue>(keymap)
  .reduce<Record<string, EditorInfoUpdater>>((
    z,
    [name, { keys = [], action }],
  ) => ({
    ...z,
    ...keys.reduce((b, { mod, key }) => ({
      ...b,
      [`${mod ? mod + ' ' : ''}${key}`]: action({
        actionName: name as edActionT.EditorAction,
      }),
    }), {}),
  }), {})

export const keymap = {
  [editorMode.normal]: flattenToKeymapKeyActions(normalKeymap),
  [editorMode.insert]: flattenToKeymapKeyActions(insertKeymap),
} as const

type PatternmapAction = {
  pattern: RegExp
  action: EditorInfoUpdater
}

const flattenToKeymapPatternActions = <T extends edActionT.EditorAction>(
  keymap: Keymap<T>,
) => Object
  .entries<KeymapValue>(keymap)
  .reduce<Array<PatternmapAction>>((z, [name, { action, pattern }]) => ([
    ...z,
    ...(pattern ? [{
      pattern,
      action: action({ actionName: name as edActionT.EditorAction })
    }] : []),
  ]), [])

export const keymapPattern = {
  [editorMode.normal]: flattenToKeymapPatternActions(normalKeymap),
  [editorMode.insert]: flattenToKeymapPatternActions(insertKeymap),
} as const
