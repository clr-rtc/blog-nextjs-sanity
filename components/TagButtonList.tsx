import { useLabel, useLangUri } from 'lib/lang'
import Link from 'next/link'
import {Keyword} from 'lib/sanity.queries'

type TagButtonProps = {
    keyword: Keyword 
  }

const TagButton = (props: TagButtonProps) => {
    const prefix = useLangUri()
    const label = useLabel(props.keyword.title, props.keyword.title_en)
    return <div key={props.keyword._id} className={"text-xs  bg-gray-300 text-indigo-900 p-1 my-1 mr-1"}>
    <Link href={prefix + "/postlist/1/" + encodeURIComponent(props.keyword._id)}>{label}</Link>
    </div>
}

type TagButtonListProps = {
    keywords: Keyword[]
    className?: string
}

const TagButtonList = (props: TagButtonListProps) => {
    
    return <div className={"  flex flex-row  flex-wrap " + props.className||''}>
        {props.keywords?.map((keyword, index) => <TagButton key={keyword._id} keyword={keyword}/>)}</div>
  
}

export default TagButtonList