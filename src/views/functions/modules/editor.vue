<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { onMounted, ref } from 'vue';

const editorContainer = ref<HTMLElement>();
const editor = ref<monaco.editor.IStandaloneCodeEditor>();

const { value } = defineProps<{
  value: string;
}>();

onMounted(() => {
  if (editorContainer.value) {
    editor.value = monaco.editor.create(editorContainer.value, {
      value: value || '// 在这里输入代码',
      language: 'javascript',
      theme: 'vs-light',
      automaticLayout: true,
      minimap: {
        enabled: true
      }
    });
  }
});
</script>

<template>
  <div ref="editorContainer" class="editor-container"></div>
</template>

<style scoped>
.editor-container {
  width: 100%;
  height: 600px;
}
</style>
