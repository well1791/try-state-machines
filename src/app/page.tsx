"use client"

import { assignInlineVars } from '@vanilla-extract/dynamic';

import * as css from './page.css'
import useKeyListener from '@/hooks/useKeyListener'
import ActionsList from '@/components/organisms/ActionsList'
import { normalHelp } from '@/data/edtiorHelperDescriptions'

export default function Home() {
  const { editor: { buffer, mode, position } } = useKeyListener()

  return (
    <main className={css.container}>
      <div className={css.content}>
        <div className={css.header}></div>

        <code className={css.body}>
          {buffer.map((line, index) => (
            <div key={`${index}${line}`}>
              {line || <br/>}
            </div>
          ))}
          <span
            className={css.caret}
            style={assignInlineVars({
              [css.row]: position.current.row.toString(),
              [css.col]: position.current.col.toString(),
            })}
          ></span>
        </code>

        <div className={css.footer}>
          {mode} {`${position.current.row}:${position.current.col}`}
        </div>
      </div>
    </main>
  )
}
