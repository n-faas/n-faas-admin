<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { useFetch } from '@vueuse/core';
import { useRouterPush } from '@/hooks/common/router';
import { useThemeStore } from '@/store/modules/theme';
import { setupMixMenuContext } from '@/layouts/context';
import GlobalHeader from '@/layouts/modules/global-header/index.vue';
import { fetchApplications } from '@/service/api/applications';
import { usePagination } from '~/packages/alova/src/client';

interface App {
  id: number;
  name: string;
  description: string;
}
// const appList = ref<App[]>([
//   { id: 1, name: 'app1', desc: 'app1 desc' },
//   { id: 2, name: 'app2', desc: 'app2 desc' },
//   { id: 3, name: 'app3', desc: 'app3 desc' }
// ]);
const { routerPush } = useRouterPush();
const handleEnterApp = (app: App) => {
  routerPush(`/app/${app.id}/functions`);
};

const themeStore = useThemeStore();

const { childLevelMenus, isActiveFirstLevelMenuHasChildren } = setupMixMenuContext();
const headerProps = computed(() => {
  const { mode, reverseHorizontalMix } = themeStore.layout;

  const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
    vertical: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false
    },
    horizontal: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    'horizontal-mix': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: reverseHorizontalMix && isActiveFirstLevelMenuHasChildren.value
    }
  };

  return headerPropsConfig[mode];
});

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
});

const appList = ref<Api.Applications.GetApplicationsResponse['data']>([]);
const getApps = async () => {
  const { data, error } = await fetchApplications({ page: 1, pageSize: 10 });
  debugger;
  if (!error && data) {
    appList.value = data.data;
    pagination.value.total = data.total;
  }
};
onMounted(() => {
  getApps();
});
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <div>
      <GlobalHeader v-bind="headerProps" />
    </div>
    <div class="flex flex-col justify-center gap-4 px-40">
      <div class="flex items-center justify-between gap-4">
        <div>
          <NTag :bordered="false" type="primary" size="large">
            <div class="flex items-center justify-center gap-2">
              <icon-majesticons:applications-add />
              {{ $t('page.dashboard.myApp') }}
            </div>
          </NTag>
        </div>
        <NInput :placeholder="$t('page.dashboard.searchAppPlaceholder')" class="!w-[500px]"></NInput>
      </div>
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
        <NCard
          v-for="app in appList"
          :key="app.id"
          bordered
          class="overflow-hidden !rounded-lg"
          content-class="!p-0 flex flex-col overflow-hidden"
        >
          <div class="absolute right-20px top-20px">
            <Icon :height="20" :width="20" icon="vscode-icons:file-type-typescript-official"></Icon>
          </div>
          <div class="flex flex-1 items-center justify-center">
            <div class="h-full w-full bg-blue-100 p-8">
              <div class="text-2xl font-bold">{{ app.name }}</div>
              <div class="text-sm text-gray-500">{{ app.description }}</div>
            </div>
          </div>
          <div class="h-[100px] w-full flex items-center justify-center p-8">
            <NButton class="w-full !rounded-lg" type="primary" size="large" @click="() => handleEnterApp(app)">
              {{ $t('page.dashboard.enterApp') }}
            </NButton>
          </div>
        </NCard>
        <NCard
          bordered
          class="h-[300px] overflow-hidden !cursor-pointer !rounded-lg !border-dashed !hover:border-solid"
          content-class="!p-0 flex flex-col overflow-hidden"
        >
          <div class="flex flex-1 items-center justify-center gap-2">
            <Icon :height="20" :width="20" icon="material-symbols:add-circle-outline"></Icon>
            <div class="text-xl font-bold">{{ $t('page.dashboard.createApp') }}</div>
          </div>
        </NCard>
      </div>
    </div>
  </div>
</template>

<style></style>
