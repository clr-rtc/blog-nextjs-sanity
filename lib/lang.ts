/**
 * @module lang.ts
 * @fileoverview This file contains a few utilities to handle multi-language content.
 * It is used by the components in the `components` folder.
 * It is not a React component, but a simple utility library.
 * The functions depend on the `useRouter` hook from `next/router` to get the current language of the page.
 * Due to React rules, these functions must also be hook functions in order to use hooks i.e. the names must start with `use`.
 */

import { useRouter } from 'next/router'

/** The URI part for the root of the website */
const ROOT_PATH = '/'

/**
 * @summary Returns the current language of the page.
 * @returns {string} The current language of the page. It is either 'en' for English or 'fr' for French.
 *
 * @description This function returns the current language of the page which is based on the presence of the `/en` prefix in the URL.
 */
export function useLang(){
    const router = useRouter()

    const isEn = router.route === '/en' || router.route.startsWith('/en/')
    return isEn? 'en' : 'fr'
}

/**
 * @summary Returns the language suffix based on the current language of the page.
 * @returns {string} The language suffix based on the current language of the page.
 *
 * @description This functionis applied to object members when there is a different value
 * for the English and French versions of the content.
 * For example, the `title` object member would be `title_en` for the English version.
 * The default language is french and the suffix is empty for that case.
 */
export function useLangSuffix(){
    return useLang() === 'en'? '_en' : ''
}

/**
 * @summary Returns the language URI segment based on the current language of the page.
 * @returns {string} The language URI segment based on the current language of the page.
 *
 * @description This function returns the language URI segment based on the current language of the page.
 * The URI segment is added at the start of the URL to switch between the English and French versions of the page.
 * That means that the English version of the pages is a subtree below the /en path
 */
export function useLangUri(){
    return useLang() === 'en' ? '/en' : ''
}

/**
 * @summary Returns the label based on the current language of the page.
 * @param fr french label
 * @param en english label
 * @returns one of the two labels based on the current language of the page
 *
 * @description This function is called with two arguments, the French and English versions of the label.
 * The function returns the French version if the current language is French and the English version otherwise.
 * This helper function is used to declutter a lot of the code in the components which needs to adapt to the language
 */
export function useLabel(fr: string, en: string){
    if (useLang() === 'en'){
        return en
    } else {
        return fr
    }
}


/**
 * #summary Returns the equivalent path in the desired language
 * @param path relative or absolute path, french or english
 * @param lang language to apply to the path
 * @returns the equivalent path in the desired language
 *
 * @description This function returns the equivalent path in the desired language.#summary
 * The input path could be french or english and the function returns the path in the specified language.
 * This function may be called repeatedly so it is assume that the language is determined prior to calling it
 * using the useLang hook
 * The path can either be absolute i.e. starting with a `/` or relative i.e. not starting with a `/` because
 * we intend to add it to another path that does start from the root.
 * Examples of absolute paths are `/posts` and `/en/posts`
 * Examples of relative paths are `posts` and `en/posts`
 */
export function localizePath(path:string, lang:string){
    if (!path){
        // This is the website root
        return ''
    }

    // If no language is specified, then the default is french
    if (!lang || lang === 'fr'){
        // We wqant to get the french path

        if (path.startsWith('/en')){
            // An english path is provided - we want to remove the /en prefix
            const otherPath = path.substring(3)

            // If the path only contains the language prefix, we return the root '/'
            return otherPath || ROOT_PATH
        }

        // This is a french path or a partial path without a language prefix
        // It can be used for french as is
        return path
    }

    // We want to return the english path

    // Based on the language, build the target language prefix

    // Determine if this is a full path or a partial path
    const isAbsolute = path[0] === ROOT_PATH

    const relativePath = isAbsolute? path.substring(1) : path

    const langPrefix = (isAbsolute? ROOT_PATH : '') + lang

    if (!relativePath){
        // This is the website root
        return langPrefix
    }

    if (path.startsWith(langPrefix)){
        return path
    }

    // Add the prefix at the start of the path. If the path already starts with a `/` then we don't add it again
    const localized =  langPrefix + '/' + relativePath

    return localized
}