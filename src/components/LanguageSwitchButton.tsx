import languageDetector from '../lib/languageDetector'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Icons from "@/components/Icons";

const LanguageSwitchLink = ({...rest}: any) => {
    const router = useRouter()

    let href = rest.href || router.asPath
    let pName = router.pathname
    const locale = router.query.locale === 'en' ? 'ru' : 'en'

    Object.keys(router.query).forEach((k) => {
        if (k === 'locale') {
            pName = pName.replace(`[${k}]`, locale)
            return
        }
        // @ts-ignore
        pName = pName.replace(`[${k}]`, router.query[k])
    })
    if (locale) {
        href = rest.href ? `/${locale}${rest.href}` : pName
    }

    return (
        <Link
            href={href}
            // @ts-ignore
            onClick={() => languageDetector.cache(locale)}
        >
            <Icons.translate
                className={`h-5 w-5 sm:h-5 sm:w-6 text-black ${rest.theme === 'dark' ? 'text-white' : 'text-black'}`}
            />
        </Link>
    );
};

export default LanguageSwitchLink