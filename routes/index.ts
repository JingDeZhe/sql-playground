import { Hono } from 'hono'
import infoRoutes from './info/index.ts'
import sqlRoutes from './sql/index.ts'

const routes = new Hono()

routes.route('/info', infoRoutes)
routes.route('/sql', sqlRoutes)

export default routes
