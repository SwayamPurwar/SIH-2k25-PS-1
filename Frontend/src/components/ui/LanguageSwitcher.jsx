import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

const LANGS = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'EN'    },
  { code: 'mr', label: 'मराठी' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={clsx(
            'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
            i18n.language === l.code
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
