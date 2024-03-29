import PostText from 'components/PostText'
import type { Part } from 'lib/sanity.queries'

type PartsProps = {
  name: string
  parts: Part[]
  align?: 'left' | 'center' | 'right' | 'none'
  className?: string
  textClassName?: string
  titleAlign?: 'left' | 'center' | 'right' | 'none'
}

const alignments = [
  { value: 'left', class: 'text-start' },
  { value: 'right', class: 'text-end' },
  { value: 'center', class: 'text-center justify-around' },
]

export default function BlogPart(props: PartsProps) {
  const searchName = props.name?.toLowerCase()
  if (!searchName || !props.parts?.length) {
    return <></>
  }

  const part = props.parts?.find((p) => p.slug.toLowerCase() === searchName)

  if (!part) {
    return <></>
  }
  const titleAlignTarget = props.titleAlign || props.align || 'center'
  const titleAlignmentClass =
    alignments.find((a) => a.value === titleAlignTarget)?.class || ''

  const alignTarget = props.align || 'center'
  const alignmentClass =
    alignments.find((a) => a.value === (props.align || 'center'))?.class || ''

  return (
    <>
      <div className="flex flex-col w-full">
        {part.appearance !== 'no-title' ? (
          <div
            className={
              'uppercase tracking-widest text-lg font-serif ' +
              titleAlignmentClass
            }
          >
            {part.title}
          </div>
        ) : (
          <></>
        )}
        {part.appearance !== 'title-only' ? (
          <div
            className={
              'text-[#8b6b36] ' + alignmentClass + ' ' + (props.className || '')
            }
          >
            <PostText content={part.content} className={props.textClassName} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
