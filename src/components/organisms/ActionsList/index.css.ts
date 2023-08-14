import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '1rem',
  padding: 0,
  margin: 0,
  listStyleType: 'none',
})
