import { CopyButton } from './CopyButton'
import './styles.css'
import { codeToHtml } from 'shiki'

export const CodeSnippet = async (props: {
  code: string
  lang: Parameters<typeof codeToHtml>[1]['lang']
}) => {
  const html = await codeToHtml(props.code, {
    lang: props.lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    cssVariablePrefix: '--shiki-',
  })

  return (
    <div>
      <CopyButton textToCopy={props.code} className="absolute top-2 right-2" />
      <div
        className="*:!bg-transparent leading-[1.3rem]"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  )
}
