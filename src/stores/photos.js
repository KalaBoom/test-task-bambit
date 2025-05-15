import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFetch } from "@vueuse/core";
import { LOCAL_STORAGE_ALBUMS } from '@/config';

export const usePhotosStore = defineStore('photos', () => {
  const API_URL = "https://jsonplaceholder.typicode.com/photos";
  const LIMIT = 30;

  const photos = ref([]);
  const loading = ref(false);
  const pagination = ref(0);

  let isAllData = false;
  const searchParams = new URLSearchParams();

  const getPhotos = computed(() => photos.value);
  const getLoading = computed(() => loading.value);

  const setPaginationSearchParams = () => {
    searchParams.set("_start", pagination.value);
    searchParams.set("_limit", LIMIT);
  };

  const setAlbumIdSearchParams = (albumIds=[]) => {
    searchParams.delete('albumId');
    albumIds.forEach(i => searchParams.append('albumId', i));
  }

  const fetchPhotos = async () => {
    const url = `${API_URL}?${searchParams.toString()}`;
    loading.value = true;
    try {
      const { data } = await useFetch(url);
      if (data.value.length < LIMIT) {
        isAllData = true
      }
      photos.value = [
        ...photos.value,
        ...JSON.parse(data.value)
      ];
    } catch {
      photos.value = [];
    } finally {
      loading.value = false;
    }
  };

  const searchPhotos = async (albumIds) => {
    reset();
    setAlbumIdSearchParams(albumIds);
    await fetchPhotos();
  }

  const sortedPhotos = async (sorted) => {
    loading.value = true;
    const sortedData = photos.value.slice(0, LIMIT).sort((a, b) => {
      const valueA = a[sorted.field];
      const valueB = b[sorted.field];
      if (sorted.operation) {
        return valueA.localeCompare ? valueA.localeCompare(valueB) : valueA - valueB;
      }
      return valueB.localeCompare ? valueB.localeCompare(valueA) : valueB - valueA;
    });
   
    resetPagination();
    photos.value = sortedData;
    setTimeout(() => loading.value = false, 100);
  };

  const nextPage = async () => {
    if (isAllData) {
      return;
    }
    pagination.value += LIMIT;
    setPaginationSearchParams();
    await fetchPhotos();
  };

  const reset = () => {
    resetPagination();
    setAlbumIdSearchParams();
  };

  const resetPagination = () => {
    isAllData = false;
    photos.value = [];
    pagination.value = 0;
    setPaginationSearchParams();
  };

  const saveInStorage = (ids) => {
    localStorage.setItem(LOCAL_STORAGE_ALBUMS, ids.join(' '));
  };

  const getFromStorage = () => {
    const storage = localStorage.getItem(LOCAL_STORAGE_ALBUMS);
    return storage || '';
  };

  setPaginationSearchParams();

  return {
    getLoading,
    getPhotos,
    fetchPhotos,
    searchPhotos,
    sortedPhotos,
    nextPage,
    reset,
    saveInStorage,
    getFromStorage
  }
})
