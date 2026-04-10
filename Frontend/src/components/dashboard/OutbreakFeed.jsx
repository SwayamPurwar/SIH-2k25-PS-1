import { useTranslation } from 'react-i18next'
import { mockAlerts } from '../../data/mockData.js'
import RiskBadge from '../ui/RiskBadge.jsx'

export default function OutbreakFeed() {
  const { t } = useTranslation()
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800">{t('dashboard.recent_alerts')}</p>
        <span className="text-xs text-primary-600 cursor-pointer hover:underline">{t('common.view_all')}</span>
      </div>
      <div className="flex flex-col gap-3">
        {mockAlerts.slice(0, 4).map(alert => (
          <div key={alert.id} className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('alert.zone', { zone: alert.zone })} · {alert.location} · {t('alert.reported_at', { time: alert.time })}
              </p>
            </div>
            <RiskBadge level={alert.level} />
          </div>
        ))}
      </div>
    </div>
  )
}
