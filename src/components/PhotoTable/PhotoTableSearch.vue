<template>
    <div class="border border-border bg-popover text-popover-foreground relative items-center rounded-md">
        <Input id="search" type="text" placeholder="1 2 3" class="pr-10 bg-input border-none" v-model="search" @keypress.enter="onSearch" />
        <span class="absolute inset-y-0 right-0 flex items-center justify-center px-2 cursor-pointer">
            <Icon name="Search" class="size-6 text-muted-foreground" @click="onSearch"/>
        </span>
    </div>
</template>

<script setup>
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon/Icon.vue";
import { usePhotosStore } from "@/stores/photos.js";
import {onMounted, ref} from "vue";

const emit = defineEmits(['search']);

const photosStore = usePhotosStore();
const search = ref(photosStore.getFromStorage());

const onSearch = () => {
    if (search.value === "") {
        photosStore.searchPhotos();
    };
    const arrayIds = search.value.split(' ');
    const nums = [];
    for (let item of arrayIds) {
        const number = Number(item);
        if (!number) {
            search.value = '';
            return;
        }
        nums.push(number);
    };
    photosStore.searchPhotos(nums);
    photosStore.saveInStorage(nums);
    emit('search');
};

onSearch();
</script>