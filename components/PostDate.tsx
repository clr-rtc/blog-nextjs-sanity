import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function PostDate({ dateString, plain }: { dateString: string, plain?: boolean }) {
  if (!dateString) return null

  const date = parseISO(dateString)
  const formatted = format(date, 'dd LLLL yyyy', {locale: fr })
  if (plain){
    return <>{formatted}</>
  }
  return <><span className="text-xs align-text-center text-blue-700 font-semibold">{formatted}</span></>
}
