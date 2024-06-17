import { readToken } from 'lib/sanity.api'

import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'
import { devMode } from 'lib/devmode'
import MessagePage from 'components/MessagePage'

interface PageProps extends SharedPageProps {
  compileTimeInfo: string[]
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { compileTimeInfo, draftMode } = props

  return (
    <MessagePage title="Diagnostics">
      {compileTimeInfo.map((info, i) => (
        <p key={i}>{info}</p>
      ))}
    </MessagePage>
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx

  const buildDate = new Date()

  const buildType = devMode() ? 'development' : 'production'
  const compileTimeInfo = [
    `Build date: ${buildDate.toLocaleDateString()} ${buildDate.toLocaleTimeString()}`,
    `Build type: ${buildType}`,
    'Draft mode: ' + (draftMode ? 'true' : 'false'),
  ]
  return {
    props: {
      compileTimeInfo,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}
