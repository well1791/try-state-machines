export const navigateAction = {
  goToInsert: 'goToInsert',
  goToNormal: 'goToNormal',
  moveCaretUp: 'moveCaretUp',
  moveCaretDown: 'moveCaretDown',
  moveCaretLeft: 'moveCaretLeft',
  moveCaretRight: 'moveCaretRight',
  // moveCaretStartOfText: 'moveCaretStartOfText',
  // moveCaretStartOfLine: 'moveCaretStartOfLine',
  // moveCaretEndOfLine: 'moveCaretEndOfLine',
} as const

export type NavigateAction = keyof typeof navigateAction

// EDITABLE ACTIONS

export const editAction = {
  inputPrintableKeys: 'inputPrintableKeys',
  addOneLineDown: 'addOneLineDown',
  deleteLeft: 'deleteLeft',
  // deleteRight: 'deleteRight',
  undo: 'undo',
  // redo: 'redo',
} as const

export type EditAction = keyof typeof editAction

// ALL

export type EditorAction = NavigateAction | EditAction
