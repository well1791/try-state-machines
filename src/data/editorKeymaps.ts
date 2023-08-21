import type * as edKeyT from './editorKeys'
import * as edKey from './editorKeys'

import type * as edActionT from './editorActions'
import * as edAction from './editorActions'

export * from './editorActions'
export * from './editorKeys'

type NonEmptyArray<T> = [T, ...T[]]
const isNonEmptyArray = <T>(a: T[]): a is NonEmptyArray<T> => a.length > 0
const cleanArray = (a: Array<string>): Buffer => isNonEmptyArray(a) ? a : ['']
const concatArr = (...args: Array<Array<string>>): Buffer => {
  const [a, ...rest] = args
  return cleanArray(a.concat(...rest))
}

export type Buffer = NonEmptyArray<string>

export const editorMode = {
  normal: 'normal',
  insert: 'insert',
} as const

export type EditorMode = keyof typeof editorMode

export type EditorCaretPosition = {
  row: number
  col: number
}

export type EditorInfo = {
  mode: EditorMode
  buffer: Buffer
  position: {
    current: EditorCaretPosition
    previous: EditorCaretPosition
  }
}

export type UsableKey<T extends edKeyT.UsableKeyValue> = {
  mod?: Readonly<Array<edKeyT.ModKeyName>>
  key: T
}

export type UsableKeys<T extends edKeyT.UsableKeyValue> =
  Readonly<Array<UsableKey<T>>>

export type KeymapData = {
  actionName: edActionT.EditorAction
}

export type EditorInfoUpdater<
  T extends edKeyT.UsableKeyValue = edKeyT.UsableKeyValue
>  = (
  editorInfo: EditorInfo,
  editorInfoUpdater: (editorInfo: EditorInfo) => void,
  keyvalue: UsableKey<T>,
) => void

export type KeymapAction<T extends edKeyT.UsableKeyValue> =
  (data: KeymapData) => EditorInfoUpdater<T>

export type KeymapValue<T extends edKeyT.UsableKeyValue = edKeyT.UsableKeyValue> = {
  keys?: UsableKeys<T>
  pattern?: RegExp
  action: KeymapAction<T>
}

export type Keymap<T extends edActionT.EditorAction> = { [K in T]: KeymapValue }

const splitStrAt = (i: number, xs: string): [string, string] =>
  [xs.slice(0, i), xs.slice(i)]

export const sharedKeymap: Keymap<edActionT.sharedAction> = {
  [edAction.sharedAction.moveCaretUp]: {
    keys: [
      { key: edKey.specialKey.arrowup },
    ],
    action: () => ({
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
  },
  [edAction.sharedAction.moveCaretDown]: {
    keys: [
      { key: edKey.specialKey.arrowdown },
    ],
    action: () => ({
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
  },
  [edAction.sharedAction.moveCaretLeft]: {
    keys: [
      { key: edKey.specialKey.arrowleft },
    ],
    action: () => ({
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
  },
  [edAction.sharedAction.moveCaretRight]: {
    keys: [
      { key: edKey.specialKey.arrowright },
    ],
    action: () => ({
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
  },
  [edAction.sharedAction.deleteLeftChar]: {
    keys: [],
    action: () => (editor, setEditor) => {
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
      }: EditorInfo): Buffer => {
        if (c.row == p.row && c.col == p.col) return b;

        const [prevL, prevR] = splitStrAt(p.col, b[p.row])
        b[p.row] = prevL.slice(0, -1) + prevR

        if (c.row != p.row) {
          b[c.row] = b[c.row] + b[p.row]
          b = concatArr(b.slice(0, p.row), b.slice(p.row + 1))
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
      })
    }
  },
}

export const normalKeymap: Keymap<edActionT.NormalAction> = {
  ...sharedKeymap,

  [edAction.sharedAction.moveCaretUp]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretUp],
    keys: [
      { key: edKey.alphaKey.w },
      { key: edKey.specialKey.arrowup },
    ],
  },
  [edAction.sharedAction.moveCaretDown]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretDown],
    keys: [
      { key: edKey.alphaKey.s },
      { key: edKey.specialKey.arrowdown },
    ],
  },
  [edAction.sharedAction.moveCaretLeft]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretLeft],
    keys: [
      { key: edKey.alphaKey.a },
      { key: edKey.specialKey.arrowleft },
    ],
  },
  [edAction.sharedAction.moveCaretRight]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretRight],
    keys: [
      { key: edKey.alphaKey.d },
      { key: edKey.specialKey.arrowright },
    ],
  },
  [edAction.sharedAction.deleteLeftChar]: {
    ...sharedKeymap[edAction.sharedAction.deleteLeftChar],
    keys: [{ key: edKey.alphaKey.o }],
  },

  [edAction.normalAction.goToInsert]: {
    keys: [{ key: edKey.unshiftedSymbolKey.semicolon }],
    action: () => (editor, setEditor) =>
      setEditor({ ...editor, mode: editorMode.insert }),
  },
} as const

export const insertKeymap: Keymap<edActionT.InsertAction> = {
  ...sharedKeymap,

  [edAction.sharedAction.deleteLeftChar]: {
    ...sharedKeymap[edAction.sharedAction.deleteLeftChar],
    keys: [{ key: edKey.specialKey.backspace }],
  },

  [edAction.insertAction.addOneLineDown]: {
    keys: [{ key: edKey.specialKey.enter }],
    action: () => (editor, setEditor) => {
      const updateCurrentPosition = ({
        position: { current: c },
      }: EditorInfo): EditorCaretPosition => ({ row: c.row + 1, col: 0 })
      const updateBuffer = ({
        buffer: b,
        position: { current: c, previous: p }
      }: EditorInfo): Buffer => {
        const [prevL, prevR] = splitStrAt(p.col, b[p.row])
        b[p.row] = prevL
        const [top, bot] = [
          b.slice(0, c.row),
          b.slice(c.row),
        ]
        return cleanArray(top.concat(prevR, bot))
      }

      const position = {
        current: updateCurrentPosition(editor),
        previous: editor.position.current,
      }
      setEditor({
        ...editor,
        buffer: updateBuffer({ ...editor, position }),
        position,
      })
    }
  },

  [edAction.insertAction.goToNormal]: {
    keys: [{ key: edKey.specialKey.escape }],
    action: () => (editor, setEditor) =>
      setEditor({ ...editor, mode: editorMode.normal }),
  },
  [edAction.insertAction.inputPrintableKeys]: {
    pattern: new RegExp('^.$'),
    action: () => ({
      buffer: b,
      position: { current: c, previous: p },
      ...ed
    }, setEditor, { key }) => {
      const [left, right] = splitStrAt(p.col, b[p.row])
      b[p.row] = left + key + right

      setEditor({
        ...ed,
        buffer: b,
        position: {
          current: {
            row: p.row,
            col: Math.min(p.col + 1, b[p.row].length),
          },
          previous: c,
        },
      })
    },
  },
} as const

type KeymapKeyAction = Record<string, EditorInfoUpdater>

const flattenToKeymapKeyActions = <T extends edActionT.EditorAction>(
  keymap: Keymap<T>,
) => Object
  .entries<KeymapValue>(keymap)
  .reduce<KeymapKeyAction>((z, [actionName, { keys = [], action }]) => ({
    ...z,
    ...keys.reduce((b, { mod, key }) => ({
      ...b,
      [`${mod ? mod + ' ' : ''}${key}`]: action({
        actionName: actionName as edActionT.EditorAction,
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
  .reduce<Array<PatternmapAction>>((z, [actionName, { action, pattern }]) => ([
    ...z,
    ...(pattern ? [{
      pattern,
      action: action({ actionName: actionName as edActionT.EditorAction })
    }] : []),
  ]), [])

export const keymapPattern = {
  [editorMode.normal]: flattenToKeymapPatternActions(normalKeymap),
  [editorMode.insert]: flattenToKeymapPatternActions(insertKeymap),
} as const
