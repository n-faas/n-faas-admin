<script setup lang="ts">
import { ref } from 'vue';

const visible = defineModel<boolean>('visible', {
  default: false
});

// const formData = defineModel<any>('formData', {
//   default: {}
// });
const formData = ref<any>({});
</script>

<template>
  <NModal v-model:show="visible">
    <NForm ref="formRef" :model="formData">
      <NFormItem path="name" label="Name">
        <NInput v-model:value="formData.name" />
      </NFormItem>
    </NForm>
  </NModal>
</template>

<style></style>
