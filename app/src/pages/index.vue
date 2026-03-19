<script lang="ts" setup>
import { ref } from 'vue'
import { CodeEditor } from 'monaco-editor-vue3'

const code = ref(`SELECT * FROM Students s;`)
const editorOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  automaticLayout: true,
}
</script>

<template>
  <div class="h-full overflow-hidden grid grid-rows-[1fr_1fr]">
    <div class="p-2">
      <CodeEditor
        v-model:value="code"
        language="sql"
        theme="vs-dark"
        :options="editorOptions"
      />
    </div>
    <div></div>
  </div>
</template>

<style lang="scss"></style>
