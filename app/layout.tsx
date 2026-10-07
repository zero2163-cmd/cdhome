import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, Noto_Sans_KR } from 'next/font/google'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument-sans' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument-serif' })
const kr = Noto_Sans_KR({ weight: ['400', '500', '600', '700'], variable: '--font-noto-kr', preload: false })

export const metadata: Metadata = {
  title: { default: '카동 CARDONG', template: '%s | 카동 CARDONG' },
  description: '카동은 자동차 경매 플랫폼 카옥션의 모회사입니다. 검증된 정보와 투명한 절차로 자동차 거래의 기준을 만듭니다.',
}

// Opens in light (the intended look); a saved choice from the theme button is applied before paint.
const themeScript = `try{var t=localStorage.getItem('cd-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){}`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" data-theme="light" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${kr.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
