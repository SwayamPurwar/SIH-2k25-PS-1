import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'

export function useSensorData(zoneId = null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sensors', zoneId],
    queryFn: async () => {
      const params = zoneId ? { zone: zoneId } : {};
      const response = await api.get('/sensors', { params });
      return response.data.data; // Assuming your API returns { success: true, data: [...] }
    },
    // Optional: Refresh data every 30 seconds for real-time feel
    refetchInterval: 30000, 
  });

  const sensors = data || [];
  const dangerCount = sensors.filter(s => s.status === 'danger').length;

  return {
    sensors,
    isLoading,
    error,
    dangerCount,
  };
}