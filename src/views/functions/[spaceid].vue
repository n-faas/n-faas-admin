<script setup lang="tsx">
import { Icon } from '@iconify/vue';
import type { MenuOption } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { h, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useRouteQuery } from '@vueuse/router';
import Editor from './modules/editor.vue';
import { setupEditor,  useEditor } from './modules/useContext';

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
      // icon: () => (
      //   <div>
      //     <Icon icon="vscode-icons:file-type-typescript-official"></Icon>
      //   </div>
      // )
    };
  });
};

const menuOptions: MenuOption[] = transformJs(functionList.value);

const handleUpdateValue = (value: string) => {
  console.log(1);
  openFile(value,value,functionList.value.find(item => item.functionName === value)?.code || '');
  console.log(2);
};


const { editorStates,tabList,openFile,closeFile,activeFunctionId } = setupEditor();
</script>

<template>
  <div class="flex gap-4">
    <NCard class="flex-[0_0_200px]" content-class="!p-0" header-class="">
      <template #header>
        activeFunctionId{{ activeFunctionId }}
        <span class="text-sm">函数列表</span>
      </template>
      <template #header-extra>
        <ButtonIcon tooltip-content="添加函数" class="h-[24px] w-[24px] p-0 text-sm">
          <icon-ic:baseline-plus />
        </ButtonIcon>
      </template>
      <!-- <NMenu :options="menuOptions" :default-value="functionId" @update:value="handleUpdateValue" /> -->
       <div v-for="item in menuOptions" :key="item.key" @click="handleUpdateValue(item.key)">
        <!-- <div>
          <Icon icon="vscode-icons:file-type-typescript-official"></Icon>
        </div> -->
        <div>{{ item.label }}</div>
       </div>
    </NCard>
    <NCard content-class="!p-0">
      <NTabs v-model:value="activeFunctionId" type="card" closable tab-style="min-width: 80px;" @close="handleClose">
        <NTabPane v-for="tab in tabList" :key="tab" :tab="tab" :name="tab">
        </NTabPane>
      </NTabs>
      <div v-show="activeFunctionId">
        <Editor  />
      </div>
    </NCard>
  </div>
</template>

<style></style>
