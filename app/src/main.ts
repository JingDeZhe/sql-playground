import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import { router } from './routes'
import { setupMonacoEditor } from './plugins/monaco-editor'

const app = createApp(App)
app.use(router)

setupMonacoEditor()
app.mount('#app')
