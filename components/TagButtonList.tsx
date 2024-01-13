import { useLabel, useLangUri } from 'lib/lang'
import Link from 'next/link'
import {Keyword} from 'lib/sanity.queries'


type TagButtonProps = {
    keyword: Keyword 
  }

export function KeywordLink({keyword}: TagButtonProps) {
    const prefix = useLangUri()
    const label = useLabel(keyword.title, keyword.title_en)
    return <Link href={prefix + "/postlist/1/" + encodeURIComponent(keyword._id)}>{label}</Link>
}       


export function BigTagButton(props: TagButtonProps){
    const prefix = useLangUri()
    
    return <span key={props.keyword._id} className={"text-lg font-semibold bg-gray-300 text-indigo-900 p-1 my-1 mr-1"}>
        <KeywordLink keyword={props.keyword} />
    </span>
}


const TagButton = (props: TagButtonProps) => {
    const prefix = useLangUri()
    
    return <span key={props.keyword._id} className={"text-xs  bg-gray-300 text-indigo-900 p-1 my-1 mr-1"}>
        <KeywordLink keyword={props.keyword} />
    </span>
}

type TagButtonListProps = {
    keywords: Keyword[]
    className?: string
}

const TagButtonList = (props: TagButtonListProps) => {
    
    return <span className={"  flex flex-row  flex-wrap " + props.className||''}>
        {props.keywords?.map((keyword, index) => <TagButton key={keyword._id} keyword={keyword}/>)}</span>
  
}

export default TagButtonList