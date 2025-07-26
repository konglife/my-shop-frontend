import { ref, onMounted } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import type { StrapiCollection, StrapiEntity, StrapiResponse } from '@/types/strapi';

// A flattened entity type for use in views, must have a string id (documentId)
export interface ViewItem {
  id: string; // documentId
}

// Define the structure for a generic service
interface CrudService<T_Response, T_Create, T_Update> {
  getAll(query?: string): Promise<StrapiResponse<StrapiEntity<T_Response>[]>>;
  create(data: T_Create): Promise<StrapiResponse<StrapiEntity<T_Response>>>;
  update(id: string, data: T_Update): Promise<StrapiResponse<StrapiEntity<T_Response>>>;
  remove(id: string): Promise<any>; // Allow remove to return any promise
}

// Define the options for the composable
interface UseCrudOptions<T_View> {
  itemName: string;
  initialFetch?: boolean;
  onFetchSuccess?: (data: T_View[]) => void;
  onFetchError?: (error: Error) => void;
  onSaveSuccess?: (item: T_View) => void;
  onSaveError?: (error: Error) => void;
  onDeleteSuccess?: (item: T_View) => void;
  onDeleteError?: (error: Error) => void;
}

export function useCrud<
  T_View extends ViewItem,
  T_Response,
  T_Create,
  T_Update
>(
  service: CrudService<T_Response, T_Create, T_Update>,
  options: UseCrudOptions<T_View>
) {
  const {
    itemName = 'item',
    initialFetch = true,
  } = options;

  const message = useMessage();
  const dialog = useDialog();

  const loading = ref(true);
  const items = ref<T_View[]>([]);
  const error = ref<Error | null>(null);

  const fetchItems = async (query?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await service.getAll(query);
      const fetchedItems = response.data.map((item: StrapiEntity<T_Response>) => {
        return {
          ...item.attributes,
          id: item.id, // The string documentId
        } as unknown as T_View;
      });
      items.value = fetchedItems;
      options.onFetchSuccess?.(fetchedItems);
    } catch (err) {
      error.value = err as Error;
      console.error(`Error fetching ${itemName}s:`, err);
      message.error(`Failed to fetch ${itemName}s.`);
      options.onFetchError?.(err as Error);
    } finally {
      loading.value = false;
    }
  };

  const saveItem = async (formData: T_Create | T_Update, documentId?: string) => {
    const isUpdating = !!documentId;
    const action = isUpdating ? 'updating' : 'creating';
    try {
      const response = isUpdating
        ? await service.update(documentId as string, formData as T_Update)
        : await service.create(formData as T_Create);
      
      const savedItemEntity = response.data;
      message.success(`${itemName} ${isUpdating ? 'updated' : 'created'} successfully!`);
      await fetchItems(); // Refresh list

      const savedItemView = {
        ...savedItemEntity.attributes,
        id: savedItemEntity.id,
      } as unknown as T_View;
      options.onSaveSuccess?.(savedItemView);
    } catch (err) {
      console.error(`Error ${action} ${itemName}:`, err);
      message.error(`Failed to save ${itemName}. Please try again.`);
      options.onSaveError?.(err as Error);
      throw err; // Re-throw to be caught in the component if needed
    }
  };

  const deleteItem = (item: T_View) => {
    dialog.warning({
      title: `Confirm Deletion`,
      content: `Are you sure you want to delete this ${itemName}?`,
      positiveText: 'Yes, Delete',
      negativeText: 'Cancel',
      onPositiveClick: async () => {
        try {
          await service.remove(item.id); // item.id is the documentId string
          message.success(`${itemName} deleted successfully!`);
          await fetchItems(); // Refresh list
          options.onDeleteSuccess?.(item);
        } catch (err) {
          console.error(`Error deleting ${itemName}:`, err);
          message.error(`Failed to delete ${itemName}. Please try again.`);
          options.onDeleteError?.(err as Error);
        }
      },
    });
  };

  if (initialFetch) {
    onMounted(() => fetchItems());
  }

  return {
    loading,
    items,
    error,
    fetchItems,
    saveItem,
    deleteItem,
  };
}
