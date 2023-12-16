import { useRouter } from 'next/router'

export function useLang(){
    const router = useRouter()

    const isEn = router.route === '/en' || router.route.startsWith('/en/')
    return isEn? 'en' : 'fr'
}

export function useLangSuffix(){
    return useLang() === 'en'? '_en' : ''
}

export function useLangUri(){
    return useLang() === 'en' ? '/en' : ''
}

export function useLabel(fr: string, en: string){
    if (useLang() === 'en'){
        return en
    } else {
        return fr
    }
}

export function localizePath(path:string, lang:string){
    if (!path){
        return ''
    }

    if (!lang || lang === 'fr'){
        if (path.startsWith('/en')){
            const otherPath = path.substring(3)
            return otherPath || '/'
        }
        return path
    }

    const prefix = path[0] === '/'? '/' : ''
  
    const langPrefix = prefix + lang
    if (path.startsWith(langPrefix)){
        return path
    }

    const localized =  langPrefix + (prefix? '' : '/') + path

    return localized
}