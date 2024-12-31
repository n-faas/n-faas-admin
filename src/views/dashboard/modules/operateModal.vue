<script setup lang="ts">
import { ref } from 'vue';

const formRef = ref<any>();
const visible = defineModel<boolean>('visible', {
  default: false
});
const formData = ref<any>({});

// const formData = ref<any>({});
</script>

<template>
  <NModal v-model:show="visible">
    <NForm ref="formRef" :model="formData">
      <NFormItem path="name" :label="$t('page.dashboard.appName')">
        <NInput v-model:value="formData.name" />
      </NFormItem>
      <NFormItem path="desc" :label="$t('page.dashboard.appDesc')">
        <NInput v-model:value="formData.desc" />
      </NFormItem>
    </NForm>
  </NModal>
</template>

<style></style>
