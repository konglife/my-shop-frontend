<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :title="isEdit ? 'Edit Customer' : 'Add New Customer'"
    style="width: 600px"
    @after-leave="handleClose"
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="name" label="Full Name">
        <n-input v-model:value="model.name" />
      </n-form-item>
      <n-form-item path="phone" label="Phone Number">
        <n-input v-model:value="model.phone" />
      </n-form-item>
      <n-form-item path="email" label="Email Address">
        <n-input v-model:value="model.email" />
      </n-form-item>
      <n-form-item path="address" label="Address">
        <n-input
          v-model:value="model.address"
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5
          }"
        />
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
import type { CustomerPayload } from '@/services/customerService';

const props = defineProps<{ 
  show: boolean;
  customer: Partial<CustomerPayload> | null;
}>();

const emit = defineEmits(['update:show', 'save']);

const formRef = ref<FormInst | null>(null);
const model = ref<Partial<CustomerPayload>>({});

const isEdit = computed(() => !!props.customer?.name); // Check if it's an edit operation

watch(() => props.show, (newVal) => {
  if (newVal) {
    model.value = props.customer ? { ...props.customer } : {};
  } else {
    model.value = {};
  }
});

const rules: FormRules = {
  name: [{ required: true, message: 'Please input the customer\'s name', trigger: 'blur' }],
  email: [{ type: 'email', message: 'Please input a valid email address', trigger: ['input', 'blur'] }],
};

const handleSave = (e: MouseEvent) => {
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
