import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function PostDate({ dateString }: { dateString: string }) {
  if (!dateString) return null

  const date = parseISO(dateString)
  return <time dateTime={dateString}><span className="text-xs text-blue-700 font-semibold">{format(date, 'dd LLLL yyyy', {locale: fr })}</span></time>
}
