import KeyAction from '@/components/atoms/KeyAction'

import * as css from './index.css'

export type Props = {
  keyname: String
  description: String
}

export default function KeyDescription({ keyname, description }: Props) {
  return (
    <div className={css.container}>
      <KeyAction>{keyname}</KeyAction>
      <span className={css.description}>{description}</span>
    </div>
  )
}
