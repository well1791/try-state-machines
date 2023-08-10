export const alphaKey = {
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

export type AlphaKeyName = keyof typeof alphaKey

export const numberKey = {
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

export type NumberKeyName = keyof typeof numberKey
export type NumberKeyValue = typeof numberKey[NumberKeyName]

export const unshiftedSymbolKey = {
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

export type UnshiftedSymbolKeyName = keyof typeof unshiftedSymbolKey
export type UnshiftedSymbolKeyValue = typeof unshiftedSymbolKey[UnshiftedSymbolKeyName]

export const shiftedSymbolKey = {
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

export type ShiftedSymbolKeyName = keyof typeof shiftedSymbolKey
export type ShiftedSymbolKeyValue = typeof shiftedSymbolKey[ShiftedSymbolKeyName]

export const printableKey = {
  ...alphaKey,
  ...numberKey,
  ...unshiftedSymbolKey,
  ...shiftedSymbolKey,
  space: ' ',
}

export type PrintableKeyName = keyof typeof printableKey
export type PrintableKeyValue = typeof printableKey[PrintableKeyName]

export const specialKey = {
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

export type SpecialKeyName = keyof typeof specialKey

export const usableKey = {
  ...printableKey,
  ...specialKey,
} as const

export type UsableKeyName = keyof typeof usableKey
export type UsableKeyValue = typeof usableKey[UsableKeyName]

export const modKey = {
  shift: 'shift',
} as const

export type ModKeyName = keyof typeof modKey
