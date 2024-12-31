<script setup lang="tsx">
import type { MenuOption } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import Editor from './modules/editor.vue';
import { setupEditor } from './modules/useContext.js';
import ResizablePanel from './modules/resizable-panel.vue';

// interface Props {
//   id?: string;
// }

// const { id } = defineProps<Props>();
// const functionId = useRouteQuery('functionName');

const nameRef = ref(1);
const message = useMessage();
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
function handleClose(name: number) {
  const { value: panels } = panelsRef;
  if (panels.length === 1) {
    message.error('最后一个了');
    return;
  }
  message.info(`关掉 ${name}`);
  const index = panels.findIndex(v => name === v);
  panels.splice(index, 1);
  if (nameRef.value === name) {
    nameRef.value = panels[index];
  }
}

const functionList = ref([
  {
    functionName: 'getXXXInfo',
    code: `module.exports = async function(context) {
    const { name = 'World' } = context.request.query;

    return {
        message: \`Hello, \${name}!\`,
        timestamp: new Date().toISOString()
    };
};`
  },
  {
    functionName: 'addXXXInfo',
    code: 'console.log("addXXXInfo")'
  },
  {
    functionName: 'delXXXInfo',
    code: 'console.log("delXXXInfo")'
  }
]);

const transformJs = (list: any[]) => {
  return list.map(item => {
    return {
      label: item.functionName,
      // label: () => <RouterLink to={`/functions?functionName=${item.functionName}`}>{item.functionName}</RouterLink>,
      key: item.functionName,
      icon: () => (
        <div>
          <Icon icon="vscode-icons:file-type-typescript-official"></Icon>
        </div>
      )
    };
  });
};

const menuOptions: MenuOption[] = transformJs(functionList.value);
const { editorStates, tabList, openFile, closeFile, activeFunctionId, getTabTitle } = setupEditor();

const handleUpdateValue = (value: string) => {
  openFile(value, value, functionList.value.find(item => item.functionName === value)?.code || '');
};

const handleUpdateValueTab = (value: string) => {
  // console.log('handleUpdateValueTab', value);
  openFile(value, value, functionList.value.find(item => item.functionName === value)?.code || '');
};
</script>

<template>
  <div class="flex gap-0.5">
    <!--
 <NCard class="flex-[0_0_200px]" content-class="!p-0" header-class="">
      <template #header>
        <span class="text-sm">函数列表</span>
      </template>
      <template #header-extra>
        <ButtonIcon tooltip-content="添加函数" class="h-[24px] w-[24px] p-0 text-sm">
          <icon-ic:baseline-plus />
        </ButtonIcon>
      </template>
      <NMenu :options="menuOptions" :default-value="activeFunctionId" @update:value="handleUpdateValue" />
    </NCard>
    <NCard content-class="!p-0">
      <NTabs
        :value="activeFunctionId"
        type="card"
        closable
        tab-style="min-width: 80px;"
        @update:value="handleUpdateValueTab"
        @close="handleClose"
      >
        <NTabPane v-for="tab in tabList" :key="tab" :tab="tab" :name="tab">
          <template #tab>
            <component :is="getTabTitle(tab)" />
          </template>
        </NTabPane>
      </NTabs>
      <div v-show="activeFunctionId">
        <Editor />
      </div>
    </NCard>
    <NCard class="w-[300px]">
      <NTabs>
        <NTabPane name="调试"></NTabPane>
        <NTabPane name="版本"></NTabPane>
      </NTabs>
    </NCard>
-->
    <ResizablePanel>
      <template #left>
        <NCard class="h-full" content-class="!p-0" header-class="">
          <template #header>
            <span class="text-sm">函数列表</span>
          </template>
          <template #header-extra>
            <ButtonIcon tooltip-content="添加函数" class="h-[24px] w-[24px] p-0 text-sm">
              <icon-ic:baseline-plus />
            </ButtonIcon>
          </template>
          <NMenu :options="menuOptions" :default-value="activeFunctionId" @update:value="handleUpdateValue" />
        </NCard>
      </template>
      <template #center>
        <NCard content-class="!p-0" class="h-full">
          <div v-if="tabList.length == 0" class="h-full flex items-center justify-center">
            <!-- <NEmpty description="Hello" class="h-full" /> -->
            Hello
          </div>
          <NTabs
            :value="activeFunctionId"
            type="card"
            closable
            tab-style="min-width: 80px;"
            @update:value="handleUpdateValueTab"
            @close="handleClose"
          >
            <NTabPane v-for="tab in tabList" :key="tab" :tab="tab" :name="tab">
              <template #tab>
                <component :is="getTabTitle(tab)" />
              </template>
            </NTabPane>
          </NTabs>
          <div v-show="activeFunctionId">
            <Editor />
          </div>
        </NCard>
      </template>
      <template #right>
        <NCard class="flex-1">
          <NTabs>
            <NTabPane name="调试"></NTabPane>
            <NTabPane name="版本"></NTabPane>
          </NTabs>
        </NCard>
      </template>
    </ResizablePanel>
  </div>
</template>

<style></style>
