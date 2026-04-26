export interface Report {
  id: string
  lat: number
  lng: number
  address: string | null
  description: string | null
  created_at: string
}

const ALERT_DURATION_MS = 2 * 60 * 60 * 1000 // 2 hours

export function alertExpiresAt(createdAt: string): Date {
  return new Date(new Date(createdAt).getTime() + ALERT_DURATION_MS)
}

export function alertMinutesLeft(createdAt: string): number {
  return Math.max(0, Math.floor((alertExpiresAt(createdAt).getTime() - Date.now()) / 60_000))
}

export function useReports() {
  async function fetchReports(): Promise<Report[]> {
    const client = useSupabaseClient()
    const cutoff = new Date(Date.now() - ALERT_DURATION_MS).toISOString()
    const { data, error } = await client
      .from('reports')
      .select('*')
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Report[]) || []
  }

  async function createReport(payload: {
    lat: number
    lng: number
    address?: string
    description?: string
  }): Promise<Report> {
    const client = useSupabaseClient()
    const { data, error } = await client
      .from('reports')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data as Report
  }

  return { fetchReports, createReport }
}
