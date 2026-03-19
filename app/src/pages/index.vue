<script lang="ts" setup>
import { ref } from 'vue'
import { CodeEditor } from 'monaco-editor-vue3'
import { executeSQL } from '@/api/sql'

const code = ref(`SELECT * FROM Students s;`)
const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true,
}

async function handleExecute() {
  const res = await executeSQL({ sql: code.value })
  console.log(res)
}
</script>

<template>
  <div class="h-full overflow-hidden grid grid-rows-[1fr_auto_1fr]">
    <div class="p-2">
      <CodeEditor
        v-model:value="code"
        language="sql"
        theme="vs-dark"
        :options="editorOptions"
      />
    </div>
    <div class="px-2 py-1">
      <button class="btn btn-sm btn-neutral" @click="handleExecute">
        执行
      </button>
    </div>
    <div></div>
  </div>
</template>

<style lang="scss"></style>
