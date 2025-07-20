<template>
  <n-modal
    :show="show"
      @update:show="$emit('update:show', $event)"
    preset="card"
    :title="isEdit ? 'Edit Category' : 'Add New Category'"
    style="width: 600px"
    @after-leave="handleClose"
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="name" label="Category Name">
        <n-input v-model:value="model.name" @keydown.enter.prevent="handleSave" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button @click="handleClose">Cancel</n-button>
        <n-button type="primary" @click="handleSave">Save</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import type { Category } from '@/types/category';

const props = defineProps<{ 
  show: boolean;
  category: Partial<Category> | null;
}>();

const emit = defineEmits(['update:show', 'save']);

const formRef = ref<FormInst | null>(null);
const model = ref<Partial<Category>>({ name: '' });

const isEdit = computed(() => !!props.category?.name);

watch(() => props.show, (newVal) => {
  if (newVal) {
    model.value = props.category ? { ...props.category } : { name: '' };
  } else {
    model.value = { name: '' };
  }
});

const rules: FormRules = {
  name: [{ required: true, message: 'Please input the category name', trigger: 'blur' }],
};

const handleSave = (e: MouseEvent | KeyboardEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('save', model.value);
    }
  });
};

const handleClose = () => {
  emit('update:show', false);
};

</script>
