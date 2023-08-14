export const alphaKeys = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
  f: 'f',
  g: 'g',
  h: 'h',
  i: 'i',
  j: 'j',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  o: 'o',
  p: 'p',
  q: 'q',
  r: 'r',
  s: 's',
  t: 't',
  u: 'u',
  v: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
} as const

export type AlphaKeyName = keyof typeof alphaKeys

export const numberKeys = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const

export type NumberKeyName = keyof typeof numberKeys
export type NumberKeyValue = typeof numberKeys[NumberKeyName]

export const unshiftedSymbolKeys = {
  backtick: '`',
  dash: '-',
  equal: '=',
  leftSquare: '[',
  rightSquare: ']',
  backslash: '\\',
  semicolon: ';',
  quote: "'",
  comma: ',',
  period: '.',
  slash: '/',
} as const

export type UnshiftedSymbolKeyName = keyof typeof unshiftedSymbolKeys
export type UnshiftedSymbolKeyValue = typeof unshiftedSymbolKeys[UnshiftedSymbolKeyName]

export const shiftedSymbolKeys = {
  tilde: '~',
  exclamation: '!',
  at: '@',
  hash: '#',
  dollar: '$',
  percentage: '%',
  caret: '^',
  andpersand: '&',
  asterisk: '*',
  leftParen: '(',
  rightParen: ')',
  underscore: '_',
  plus: '+',
  leftCurly: '{',
  rightCurly: '}',
  pipe: '|',
  colon: ':',
  dubleQuote: '"',
  leftAngle: '<',
  rightAngle: '>',
  question: '?',
} as const

export type ShiftedSymbolKeyName = keyof typeof shiftedSymbolKeys
export type ShiftedSymbolKeyValue = typeof shiftedSymbolKeys[ShiftedSymbolKeyName]

export const specialKeys = {
  escape: 'escape',
  tab: 'tab',
  arrowup: 'arrowup',
  arrowdown: 'arrowdown',
  arrowleft: 'arrowleft',
  arrowright: 'arrowright',
  enter: 'enter',
  backspace: 'backspace',
  delete: 'delete',
  pageup: 'pageup',
  pagedown: 'pagedown',
  home: 'home',
  end: 'end',
} as const

export type SpecialKeyName = keyof typeof specialKeys

export const modKeys = {
  shift: 'shift',
} as const

export type ModKeyName = keyof typeof modKeys

export const printableKeys = {
  ...alphaKeys,
  ...numberKeys,
  ...unshiftedSymbolKeys,
  ...shiftedSymbolKeys,
  space: ' ',
}

export type PrintableKeyName = keyof typeof printableKeys
export type PrintableKeyValue = typeof printableKeys[PrintableKeyName]

export const usableKeys = {
  ...printableKeys,
  ...specialKeys,
} as const

export type UsableKeyName = keyof typeof usableKeys
export type UsableKeyValue = typeof usableKeys[UsableKeyName]
