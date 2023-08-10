// SHARED ACTIONS
export const sharedAction = {
  moveCaretUp: 'moveCaretUp',
  moveCaretDown: 'moveCaretDown',
  moveCaretLeft: 'moveCaretLeft',
  moveCaretRight: 'moveCaretRight',
  deleteLeftChar: 'deleteLeftChar',
  // deleteRightChar: 'deleteRightChar',
  // addTabSpaces: 'addTabSpaces',
  // moveCaretStartOfText: 'moveCaretStartOfText',
  // moveCaretStartOfLine: 'moveCaretStartOfLine',
  // moveCaretEndOfLine: 'moveCaretEndOfLine',
  // undo: 'undo',
  // redo: 'redo',
} as const

export type sharedAction = keyof typeof sharedAction

// NORMAL MODE

export const normalAction = {
  ...sharedAction,
  goToInsert: 'goToInsert',
} as const

export type NormalAction = keyof typeof normalAction

// INSERT MODE

export const insertAction = {
  ...sharedAction,
  goToNormal: 'goToNormal',
  inputPrintableKeys: 'inputPrintableKeys',
  addOneLineDown: 'addOneLineDown',
} as const

export type InsertAction = keyof typeof insertAction

// ALL

export type EditorAction = NormalAction | InsertAction
