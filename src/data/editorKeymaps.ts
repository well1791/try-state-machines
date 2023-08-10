import type * as edKeyT from './editorKeys'
import type * as edActionT from './editorActions'
import * as edKey from './editorKeys'
import * as edAction from './editorActions'

export * from './editorActions'
export * from './editorKeys'

export type Buffer = Array<string>

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

export type KeymapData<T extends edKeyT.UsableKeyValue> = {
  actionName: edActionT.EditorAction
  keys: UsableKeys<T>
}

export type EditorInfoUpdater<
  T extends edKeyT.UsableKeyValue = edKeyT.UsableKeyValue
>  = (
  editorInfo: EditorInfo,
  editorInfoUpdater: (editorInfo: EditorInfo) => void,
  keyvalue: UsableKey<T>,
) => void

export type KeymapAction<T extends edKeyT.UsableKeyValue> =
  (data: KeymapData<T>) => EditorInfoUpdater<T>

export type KeymapValue<T extends edKeyT.UsableKeyValue = edKeyT.UsableKeyValue> = {
  keys: UsableKeys<T>
  action: KeymapAction<T>
}

export type Keymap<T extends edActionT.EditorAction> = { [K in T]: KeymapValue }

const splitAt = (i: number, xs: string) => [xs.slice(0, i), xs.slice(i)]

export const sharedKeymap: Keymap<edActionT.sharedAction> = {
  [edAction.sharedAction.moveCaretUp]: {
    keys: [
      { key: edKey.specialKeys.arrowup },
    ],
    action: () => ({ buffer, position: { current }, ...editor }, setEditor) => {
      const prevRow = current.row - 1
      const row = Math.max(prevRow, 0)
      const col = Math.min(current.col, buffer[row].length)
      setEditor({
        ...editor,
        buffer,
        position: {
          current: { row, col },
          previous: current,
        }
      })
    },
  },
  [edAction.sharedAction.moveCaretDown]: {
    keys: [
      { key: edKey.specialKeys.arrowdown },
    ],
    action: () => ({ buffer, position: { current }, ...editor }, setEditor) => {
      const nextRow = current.row + 1
      const row = Math.min(nextRow, buffer.length - 1)
      const col = Math.min(current.col, buffer[row].length)
      setEditor({
        ...editor,
        buffer,
        position: {
          current: { row, col },
          previous: current,
        }
      })
    },
  },
  [edAction.sharedAction.moveCaretLeft]: {
    keys: [
      { key: edKey.specialKeys.arrowleft },
    ],
    action: () => ({ buffer, position: { current }, ...editor }, setEditor) => {
      if (current.row == 0 && current.col == 0) {
        return;
      }
      let row = current.row
      let col = current.col - 1
      if (col < 0) {
        row = Math.max(current.row - 1, 0)
        col = buffer[row].length
      }
      setEditor({
        ...editor,
        buffer,
        position: {
          current: { row, col },
          previous: current,
        }
      })
    },
  },
  [edAction.sharedAction.moveCaretRight]: {
    keys: [
      { key: edKey.specialKeys.arrowright },
    ],
    action: () => ({ buffer, position: { current }, ...editor }, setEditor) => {
      const lastRow = buffer.length - 1
      if (current.row == lastRow && current.col == buffer[lastRow].length) {
        return;
      }

      let row = current.row
      let col = current.col + 1
      if (col > buffer[current.row].length) {
        row = Math.min(current.row + 1, lastRow)
        col = 0
      }
      setEditor({
        ...editor,
        buffer,
        position: {
          current: { row, col },
          previous: current,
        }
      })
    },
  },
  [edAction.sharedAction.deleteLeftChar]: {
    keys: [],
    action: () => ({ buffer, position: { current }, ...editor }, setEditor) => {
      let row = current.row
      let col = Math.max(current.col - 1, 0)
      if (buffer[current.row].length == 0 || current.col == 0) {
        const line = buffer[current.row]
        const [top, bot] = [
          buffer.slice(0, current.row),
          buffer.slice(current.row + 1),
        ]
        const updatedBuffer = top.concat(bot)
        buffer = updatedBuffer.length === 0 ? [''] : updatedBuffer
        row = Math.max(current.row - 1, 0)
        col = buffer[row].length
        buffer[row] = buffer[row] + line
      } else {
        const [left, right] = splitAt(current.col, buffer[current.row])
        buffer[current.row] = left.slice(0, -1) + right
      }

      setEditor({
        ...editor,
        buffer,
        position: {
          current: { row, col },
          previous: current,
        }
      })
    }
  },
}

export const normalKeymap: Keymap<edActionT.NormalAction> = {
  ...sharedKeymap,

  [edAction.sharedAction.moveCaretUp]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretUp],
    keys: [
      { key: edKey.alphaKeys.w },
      { key: edKey.specialKeys.arrowup },
    ],
  },
  [edAction.sharedAction.moveCaretDown]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretDown],
    keys: [
      { key: edKey.alphaKeys.s },
      { key: edKey.specialKeys.arrowdown },
    ],
  },
  [edAction.sharedAction.moveCaretLeft]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretLeft],
    keys: [
      { key: edKey.alphaKeys.a },
      { key: edKey.specialKeys.arrowleft },
    ],
  },
  [edAction.sharedAction.moveCaretRight]: {
    ...sharedKeymap[edAction.sharedAction.moveCaretRight],
    keys: [
      { key: edKey.alphaKeys.d },
      { key: edKey.specialKeys.arrowright },
    ],
  },
  [edAction.sharedAction.deleteLeftChar]: {
    ...sharedKeymap[edAction.sharedAction.deleteLeftChar],
    keys: [{ key: edKey.alphaKeys.o }],
  },

  [edAction.normalAction.goToInsert]: {
    keys: [{ key: edKey.unshiftedSymbolKeys.semicolon }],
    action: () => (editor, setEditor) =>
      setEditor({ ...editor, mode: editorMode.insert }),
  },
} as const

export const insertKeymap: Keymap<edActionT.InsertAction> = {
  ...sharedKeymap,

  [edAction.sharedAction.deleteLeftChar]: {
    ...sharedKeymap[edAction.sharedAction.deleteLeftChar],
    keys: [{ key: edKey.specialKeys.backspace }],
  },

  [edAction.insertAction.addOneLineDown]: {
    keys: [{ key: edKey.specialKeys.enter }],
    action: () => ({ buffer, position: { current }, ...editor }, setEditor) => {
      const [left, right] = splitAt(current.col, buffer[current.row])
      buffer[current.row] = left
      const row = current.row + 1
      const [top, bot] = [
        buffer.slice(0, row),
        buffer.slice(row),
      ]
      setEditor({
        ...editor,
        buffer: top.concat(right, bot),
        position: {
          current: { row, col: 0 },
          previous: current,
        }
      })
    }
  },

  [edAction.insertAction.goToNormal]: {
    keys: [{ key: edKey.specialKeys.escape }],
    action: () => (editor, setEditor) =>
      setEditor({ ...editor, mode: editorMode.normal }),
  },
  [edAction.insertAction.inputPrintableKeys]: {
    keys: Object.values(edKey.printableKeys).map((key) => [
      { mod: [edKey.modKeys.shift], key },
      { key },
    ]).flat(),
    action: () => (
      { buffer, position: { current }, ...editor },
      setEditor,
      { key },
    ) => {
      const [left, right] = splitAt(current.col, buffer[current.row])
      buffer[current.row] = left + key + right

      setEditor({
        ...editor,
        buffer,
        position: {
          current: {
            row: current.row,
            col: Math.min(current.col + 1, buffer[current.row].length),
          },
          previous: current,
        },
      })
    },
  },
} as const

const flattenKeymapActions = <T extends edActionT.EditorAction>(
  keymap: Keymap<T>,
) => Object
  .entries<KeymapValue>(keymap)
  .reduce<Record<string, EditorInfoUpdater>>((
    a,
    [actionName, { keys, action }],
  ) => ({
    ...a,
    ...keys.reduce((b, { mod, key }) => ({
      ...b,
      [`${mod ? mod + ' ' : ''}${key}`]: action({
        actionName: actionName as edActionT.EditorAction,
        keys,
      }),
    }), {})
  }), {})

export const keymap = {
  [editorMode.normal]: flattenKeymapActions(normalKeymap),
  [editorMode.insert]: flattenKeymapActions(insertKeymap),
} as const
