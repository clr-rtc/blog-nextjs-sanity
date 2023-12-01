import speakingurl from 'speakingurl'
import {useDocumentOperation} from 'sanity'

export function SlugOnSave(originalPublishAction) {
   

  const BetterAction = (props) => {
    // use the hook to get access to the patch function with the current document
    const {patch} = useDocumentOperation(props.id, props.type)
    const patchSlug = (slugValue) => {
      patch.execute([{set: {slug: {current: slugValue, _type: 'slug'}}}])
    }
    const originalResult = originalPublishAction(props)
    return {
      ...originalResult,
      label: 'Publier',
      onHandle: () => {
        
        // check for a title and existing slug
        console.log(`SLUG:${props.slug}`)
        if ((props.type !== 'post' || props.type !== 'page') && props.draft.title && !props.draft.slug) {
          // use the generator package used in sanity core with default values
          const generatedSlug = props.draft.title ? defaultSlugify(props.draft.title) : null
          // double check we've got a slug and patch it in
          if (generatedSlug) {
            patchSlug(generatedSlug)
          }
        }
        // then delegate to original handler
        originalResult.onHandle()
      },
    }
  }
  return BetterAction
}

export const defaultSlugify = (value) => {
  const slugifyOpts = {truncate: 200, symbols: true}
  return value ? speakingurl(value, slugifyOpts) : ''
}