<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :title="isEdit ? 'Edit Product' : 'Add New Product'"
    style="width: 600px"
    @after-leave="handleClose"
  >
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="name" label="Product Name">
        <n-input v-model:value="model.name" />
      </n-form-item>
      <n-form-item path="selling_price" label="Selling Price">
        <n-input-number v-model:value="model.selling_price" :min="0" style="width: 100%">
          <template #prefix>
            ฿
          </template>
        </n-input-number>
      </n-form-item>
      <n-form-item path="category" label="Category">
        <n-select
          v-model:value="model.category"
          :options="categoryOptions"
          :loading="loadingCategories"
          placeholder="Select a category"
          filterable
        />
      </n-form-item>
      <n-form-item path="unit" label="Unit">
        <n-select
          v-model:value="model.unit"
          :options="unitOptions"
          :loading="loadingUnits"
          placeholder="Select a unit"
          filterable
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
  NInputNumber,
  NSelect,
  NButton,
  NSpace,
  type FormInst,
  type FormRules,
} from 'naive-ui';
import type { Product } from '@/types/product';
import type { ProductPayload } from '@/services/productService';
import type { Category } from '@/types/category';
import type { Unit } from '@/types/unit';
import type { StrapiEntity } from '@/types/strapi';
import { getCategories } from '@/services/categoryService';
import { getUnits } from '@/services/unitService';

// --- Props & Emits ---
const props = defineProps<{ 
  show: boolean;
  product: StrapiEntity<Product> | null;
}>();
const emit = defineEmits(['update:show', 'save']);

// --- Form State ---
const formRef = ref<FormInst | null>(null);
const model = ref<Partial<ProductPayload>>({});

const isEdit = computed(() => !!props.product);

const rules: FormRules = {
  name: [{ required: true, message: 'Please input the product name', trigger: 'blur' }],
  selling_price: [{ type: 'number', required: true, message: 'Please input the selling price', trigger: 'blur' }],
  category: [{ required: true, message: 'Please select a category', trigger: 'change' }],
  unit: [{ required: true, message: 'Please select a unit', trigger: 'change' }],
};

// --- Select Options State ---
const categories = ref<StrapiEntity<Category>[]>([]);
const units = ref<StrapiEntity<Unit>[]>([]);
const loadingCategories = ref(false);
const loadingUnits = ref(false);

const categoryOptions = computed(() => 
  categories.value.map(c => ({ label: c.attributes.name, value: c.documentId }))
);

const unitOptions = computed(() => 
  units.value.map(u => ({ label: u.attributes.name, value: u.documentId }))
);

// --- Data Fetching ---
const fetchSelectData = async () => {
  loadingCategories.value = true;
  loadingUnits.value = true;
  try {
    const [categoryRes, unitRes] = await Promise.all([
      getCategories(),
      getUnits()
    ]);
    categories.value = categoryRes.data;
    units.value = unitRes.data;
  } catch (error) {
    console.error('Failed to fetch data for selects', error);
    // Maybe show a message to the user
  } finally {
    loadingCategories.value = false;
    loadingUnits.value = false;
  }
};

// --- Logic ---
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Fetch data when modal opens
    fetchSelectData();
    
    // Populate form model
    if (props.product) {
      // Editing: map existing data to the payload structure
      model.value = {
        name: props.product.attributes.name,
        selling_price: props.product.attributes.selling_price,
        // Safely access nested documentId
        category: props.product.attributes.category?.data?.documentId,
        unit: props.product.attributes.unit?.data?.documentId,
      };
    } else {
      // Creating: reset to default
      model.value = {
        name: '',
        selling_price: 0,
      };
    }
  }
});

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
