import KeyDescription from '@/components/molecules/KeyDescription'
import type { Props as KeyDescProps } from '@/components/molecules/KeyDescription'

import * as css from './index.css'

type Props = {
  keysList: Array<KeyDescProps>
  className?: string
}

export default function ActionsList({ keysList, className }: Props) {
  return (
  <ul className={[css.container, className].join(' ')}>
    {keysList.map((keydesc) => (
      <li key={`li-${keydesc.keyname}`}>
        <KeyDescription {...keydesc} />
      </li>
    ))}
  </ul>
  )
}
