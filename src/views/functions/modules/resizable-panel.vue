<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

// 状态管理
const leftWidth = ref(250);
const rightWidth = ref(250);
const isResizing = ref(false);
const container = ref(null);
const activeFunction = ref('getXXXInfo');
const activeTab = ref('getXXXInfo');

// 配置项
const minWidth = 200;
const maxWidth = 600;

// 示例数据
const functions = ['getXXXInfo', 'addXXXInfo', 'delXXXInfo'];
const tabs = ['getXXXInfo', 'addXXXInfo'];
const codeContent = `module.exports = async function(context) {
  const { name = 'World' } = context.request.query;

  return {
    message: \`Hello, \${name}!\`,
    timestamp: new Date().toISOString()
  };
};`;
const activeIndex = ref(1);
// 拖拽相关方法
const startResizing = (index: number) => {
  isResizing.value = true;
  activeIndex.value = index;
  e.preventDefault();
};

const stopResizing = () => {
  isResizing.value = false;
};

const resize = e => {
  if (!isResizing.value || !container.value) return;

  const containerRect = container.value.getBoundingClientRect();
  let newWidth = 0;
  if (activeIndex.value === 1) {
    newWidth = e.clientX - containerRect.left;
    leftWidth.value = Math.min(Math.max(newWidth, minWidth), maxWidth);
  } else {
    newWidth = containerRect.right - e.clientX;
    rightWidth.value = Math.min(Math.max(newWidth, minWidth), maxWidth);
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('mousemove', resize);
  window.addEventListener('mouseup', stopResizing);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', resize);
  window.removeEventListener('mouseup', stopResizing);
});
</script>

<template>
  <div ref="container" class="h-full w-full flex overflow-hidden">
    <!-- 左侧面板 -->
    <!-- <div class="shrink-0 overflow-auto" :style="{ width: `${leftWidth}px` }"> -->
    <!--
 <div class="p-4">
        <h2 class="mb-4 font-semibold">函数列表</h2>
        <nav class="space-y-2">
          <div
            v-for="item in functions"
            :key="item"
            class="cursor-pointer rounded-md p-2 transition-colors"
            :class="[activeFunction === item ? 'bg-primary/10' : 'hover:bg-primary/5']"
            @click="activeFunction = item"
          >
            {{ item }}
          </div>
        </nav>
      </div>
-->
    <!-- </div> -->
    <div class="h-full shrink-0" :style="{ width: `${leftWidth}px` }">
      <slot name="left" />
    </div>

    <!-- 拖拽手柄 -->
    <div
      class="bg-border relative w-1 flex cursor-col-resize items-center justify-center transition-colors hover:bg-primary/50"
      @mousedown="() => startResizing(1)"
    >
      <!-- <div class="h-4 w-4 flex items-center justify-center">⋮</div> -->
    </div>

    <!-- 中间面板 -->
    <div class="h-full flex-1 shrink-0 overflow-auto">
      <slot name="center" />
    </div>
    <!-- 拖拽手柄 -->
    <div
      class="bg-border relative w-1 flex cursor-col-resize items-center justify-center transition-colors hover:bg-primary/50"
      @mousedown="() => startResizing(2)"
    >
      <!-- <div class="h-4 w-4 flex items-center justify-center">⋮</div> -->
    </div>
    <!-- 右侧面板 -->
    <div class="h-full shrink-0" :style="{ width: `${rightWidth}px` }">
      <slot name="right" />
    </div>
  </div>
</template>

<style></style>
