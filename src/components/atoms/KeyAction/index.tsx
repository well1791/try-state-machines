import { PropsWithChildren } from 'react'

import * as css from './index.css'

type Props = PropsWithChildren<{ className?: string }>

export default function KeyAction({ children, className }: Props) {
  return (
    <span className={[css.container, className].join(' ')}>
      {children}
    </span>
  )
}
