export interface Report {
  id: string
  lat: number
  lng: number
  address: string | null
  description: string | null
  created_at: string
}

export function useReports() {
  async function fetchReports(): Promise<Report[]> {
    const client = useSupabaseClient()
    const { data, error } = await client
      .from('reports')
      .select('*')
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
