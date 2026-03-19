import { Hono } from 'hono'
import { Database } from 'bun:sqlite'
import fs from 'node:fs'
import path from 'node:path'

const sql = new Hono()

// 确保data目录存在
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// SQL执行接口
sql.post('/execute', async (c) => {
  try {
    const { sql: sqlText, database = 'playground.db' } = await c.req.json()

    if (!sqlText || sqlText.trim() === '') {
      return c.json({ error: 'SQL语句不能为空' }, 400)
    }

    // 数据库文件路径
    const dbPath = path.join(dataDir, database)

    // 连接数据库（如果文件不存在会自动创建）
    const db = new Database(dbPath)

    // 执行SQL
    const results = await executeSQL(db, sqlText)

    // 关闭数据库连接
    db.close()

    return c.json({
      success: true,
      results,
      database,
    })
  } catch (error: any) {
    console.error('SQL执行错误:', error)
    return c.json(
      {
        error: error.message || 'SQL执行失败',
      },
      500,
    )
  }
})

// 获取数据库列表
sql.get('/databases', (c) => {
  try {
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith('.db'))
      .map((file) => ({
        name: file,
        path: path.join(dataDir, file),
        size: fs.statSync(path.join(dataDir, file)).size,
      }))

    return c.json({ databases: files })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// 执行SQL的辅助函数
async function executeSQL(db: Database, sqlText: string) {
  const statements = sqlText
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const results = []

  for (const statement of statements) {
    try {
      // 判断是查询还是更新操作
      const isSelect = statement.toUpperCase().startsWith('SELECT')

      if (isSelect) {
        // 查询操作
        const stmt = db.prepare(statement)
        const rows = stmt.all() as any[]

        // 获取列信息
        const columns = rows.length > 0 ? Object.keys(rows[0]) : []

        results.push({
          type: 'select',
          statement,
          columns,
          rows,
          rowCount: rows.length,
        })
      } else {
        // 更新操作 (INSERT, UPDATE, DELETE, CREATE等)
        const stmt = db.prepare(statement)
        const result = stmt.run()

        results.push({
          type: 'update',
          statement,
          changes: result.changes,
          lastInsertId: result.lastInsertRowid,
        })
      }
    } catch (error: any) {
      results.push({
        type: 'error',
        statement,
        error: error.message,
      })

      // 如果遇到错误，停止执行后续语句
      break
    }
  }

  return results
}

// 创建新数据库
sql.post('/databases/create', async (c) => {
  try {
    const { name } = await c.req.json()

    if (!name) {
      return c.json({ error: '数据库名称不能为空' }, 400)
    }

    // 确保文件名以.db结尾
    const dbName = name.endsWith('.db') ? name : `${name}.db`
    const dbPath = path.join(dataDir, dbName)

    if (fs.existsSync(dbPath)) {
      return c.json({ error: '数据库已存在' }, 400)
    }

    // 创建空数据库
    const db = new Database(dbPath)
    db.close()

    return c.json({
      success: true,
      database: dbName,
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default sql
