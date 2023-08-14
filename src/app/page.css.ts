import { createVar, style, keyframes } from '@vanilla-extract/css';

export const row = createVar();
export const col = createVar();
export const fontHeight = createVar();

export const container = style({
  maxInlineSize: 600,
  marginInline: 'auto',
  paddingBlock: '2rem',
});

export const content = style({
  borderRadius: 8,
  border: '2px solid black',
})

export const header = style({
  borderBlockEnd: '2px solid black',
  paddingBlock: '1rem',
  paddingInline: '.5rem',
})

export const body = style({
  display: 'block',
  // padding: '1rem',
  minBlockSize: 300,
  position: 'relative',
})

export const footer = style({
  borderBlockStart: '2px solid black',
  paddingBlock: '1rem',
  paddingInline: '.5rem',
})

const blink = keyframes({
  from: { opacity: '0' },
  to: { opacity: '100%' }
});

export const caret = style({
  vars: {
    [fontHeight]: '1.15em',
    [row]: '0',
    [col]: '0',
  },

  display: 'block',
  backgroundColor: 'gray',
  blockSize: fontHeight,
  inlineSize: '0.2ch',

  position: 'absolute',
  insetBlockStart: `calc(${row} * ${fontHeight})`,
  insetInlineStart: `calc(${col} * 1ch)`,

  animation: `.65s infinite alternate ${blink}`,
})
