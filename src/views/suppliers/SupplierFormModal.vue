<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :title="isEdit ? 'Edit Supplier' : 'Add New Supplier'"
    style="width: 600px"
    @after-leave="handleClose"
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="name" label="Company Name">
        <n-input v-model:value="model.name" />
      </n-form-item>
      <n-form-item path="contact_person" label="Contact Person">
        <n-input v-model:value="model.contact_person" />
      </n-form-item>
      <n-form-item path="phone" label="Phone Number">
        <n-input v-model:value="model.phone" />
      </n-form-item>
      <n-form-item path="email" label="Email Address">
        <n-input v-model:value="model.email" />
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
import type { SupplierPayload } from '@/services/supplierService';

const props = defineProps<{ 
  show: boolean;
  supplier: Partial<SupplierPayload> | null;
}>();

const emit = defineEmits(['update:show', 'save']);

const formRef = ref<FormInst | null>(null);
const model = ref<Partial<SupplierPayload>>({});

const isEdit = computed(() => !!props.supplier?.name);

watch(() => props.show, (newVal) => {
  if (newVal) {
    model.value = props.supplier ? { ...props.supplier } : {};
  } else {
    model.value = {};
  }
});

const rules: FormRules = {
  name: [{ required: true, message: 'Please input the company name', trigger: 'blur' }],
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
