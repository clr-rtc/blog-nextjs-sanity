import Link from 'next/link'

type TagButtonProps = {
    value: string
    label: string
  }

const TagButton = (props: TagButtonProps) => {
    return <span className={"text-xs bg-gray-300 text-indigo-900 p-1"}>
    <Link href={"/postlist/1/" + encodeURIComponent(props.value)}>{props.label}</Link>
    </span>
}

type TagButtonListProps = {
    tags: TagButtonProps[]
}

const TagButtonList = (props: TagButtonListProps) => {
  
    return <span className="space-x-2">{props.tags?.map((t, index) => <TagButton key={index} value={t.value} label={t.label}/>)}</span>
  
}

export default TagButtonList