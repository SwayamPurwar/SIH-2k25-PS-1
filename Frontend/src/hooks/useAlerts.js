import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'

export function useAlerts(zoneId = null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['alerts', zoneId],
    queryFn: async () => {
      const params = { status: 'active' };
      if (zoneId) params.zone = zoneId;
      
      const response = await api.get('/alerts', { params });
      return response.data.data; // Assuming backend returns { success: true, data: [...] }
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const alerts = data || [];
  const criticalCount = alerts.filter(a => a.level === 'high').length;

  return {
    alerts,
    isLoading,
    error,
    criticalCount,
  }
}