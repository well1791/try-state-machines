"use client"

import { assignInlineVars } from '@vanilla-extract/dynamic';

import * as css from './page.css'
import useEditorHandler from '@/hooks/useEditorHandler'

export default function Home() {
  const { buffer, mode, position } = useEditorHandler()

  return (
    <main className={css.container}>
      <div className={css.content}>
        <div className={css.header}>
          no file creation yet ^^
        </div>

        <code className={css.body}>
          {buffer.map((line, index) => (
            <div key={`${index}${line}`}>
              {line || <br/>}
            </div>
          ))}
          <span
            className={css.caret[mode]}
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
