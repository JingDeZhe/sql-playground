import { request } from './request'
import type {
  ExecuteSQLParams,
  ExecuteSQLResult,
  DatabaseInfo,
} from '@shared/type'

const API_BASE = 'sql'

export async function executeSQL({
  sql,
  database,
}: ExecuteSQLParams): Promise<ExecuteSQLResult> {
  const response = await request.post(`${API_BASE}/execute`, {
    json: { sql, database },
  })

  if (!response.ok) {
    const error = await response.json<any>()
    throw new Error(error.error || '请求失败')
  }

  return response.json()
}

export async function getDatabases(): Promise<DatabaseInfo[]> {
  const response = await fetch(`${API_BASE}/databases`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '获取数据库列表失败')
  }

  const data = await response.json()
  return data.databases
}

export async function createDatabase(
  name: string,
): Promise<{ database: string }> {
  const response = await fetch(`${API_BASE}/databases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || '创建数据库失败')
  }

  return response.json()
}
