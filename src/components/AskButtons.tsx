// Dev-only: Stop while Claude is answering, otherwise Ask Claude (or Ask again
// once there is an answer). body is what the private-readings endpoint accepts.
import { useDevText } from './dev-text.ts'
import type { useClaudeStream } from './useClaudeStream.ts'

type Props = { claude: ReturnType<typeof useClaudeStream>; body: object }

export function AskButtons({ claude, body }: Props) {
  const t = useDevText()
  if (claude.status === 'streaming') {
    return (
      <button type="button" className="secondary" onClick={claude.stop}>
        {t('ask.stop')}
      </button>
    )
  }
  return (
    <button type="button" className="secondary" onClick={() => claude.ask(body)}>
      {claude.status === 'idle' ? t('ask.ask') : t('ask.again')}
    </button>
  )
}
