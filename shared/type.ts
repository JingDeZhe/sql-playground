export interface ExecuteSQLParams {
  sql: string
  database?: string
}

export interface ExecuteSQLResult {
  success: boolean
  results: Array<{
    type: 'select' | 'update' | 'error'
    statement: string
    columns?: string[]
    rows?: any[]
    rowCount?: number
    changes?: number
    lastInsertId?: number
    error?: string
  }>
  database: string
}

export interface DatabaseInfo {
  name: string
  path: string
  size: number
}
