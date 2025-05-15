<template>
  <main class="bg-background h-[calc(100vh-50px)] pt-5">
    <div class="w-[600px] mx-auto">
      <PhotoTableSearch class="mb-2" @search="onSearch" />
      <div class="rounded-md border border-border rounded-radius h-[600px] ">
        <Table v-if="!loading" class="h-full" ref="tableRef" @scroll="onScroll">
          <TableHeader class="sticky top-0 bg-muted">
            <TableRow class="border-none shadow"
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <TableHead v-for="header in headerGroup.headers" :key="header.id" class="p-0">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="bg-muted text-muted-foreground">
            <template v-if="table.getRowModel().rows?.length">
              <template v-for="row in table.getRowModel().rows" :key="row.id">
                <TableRow>
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </TableCell>
                </TableRow>
              </template>
            </template>

            <TableRow v-else>
              <TableCell :colspan="columns.length" class="h-24">
                <div class="flex justify-center flex-col items-center gap-3">
                  <span class="text-5xl">Не найдено фото</span>
                  <img src="@/assets/images/not-found.webp" class="w-[400px] h-[400px]" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Skeleton v-else class="w-full h-full" />
      </div>
    </div>
    
  </main>
</template>

<script setup>
import { valueUpdater } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-vue-next";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { h, ref, computed, onMounted, watch, nextTick } from "vue";
import { usePhotosStore } from "@/stores/photos.js";
import PhotoTableSearch from "@/components/PhotoTable/PhotoTableSearch.vue";

const photoStore = usePhotosStore();
const loading = computed(() => photoStore.getLoading);
const data = computed(() => photoStore.getPhotos);
const sorted = ref({
  field: '',
  operation: 0
});

const tableScrollTop = ref(0);

const classColumn = "capitalize text-ellipsis overflow-hidden";
const getSortedHeader = (column, title) => {
  let sortIcon = ArrowUpDown;
  if (column.id === sorted.value.field && sorted.value.operation === 0) {
    sortIcon = ChevronDown
  } else if (column.id === sorted.value.field && sorted.value.operation === 1) {
    sortIcon = ChevronUp
  };

  return h(Button, { 
    variant: 'ghost',
    class: "cursor-pointer",
    onClick: () => onSorted(column),
  }, () => [title, h(sortIcon, { class: 'ml-2 h-4 w-4' })]);
}

const columns = [
  {
    accessorKey: "id",
    header: ({ column }) => getSortedHeader(column, 'Ид'),
    cell: ({ row }) => h("div", { class: `w-full ${classColumn}`, title: row.getValue("id") }, row.getValue("id")),
  },
  {
    accessorKey: "albumId",
    header: ({ column }) => getSortedHeader(column, 'Альбом'),
    cell: ({ row }) => h("div", { class: `w-full ${classColumn}`, title: row.getValue("albumId") }, row.getValue("albumId")),
  },
  {
    accessorKey: "title",
    header: ({ column }) => getSortedHeader(column, 'Название'),
    cell: ({ row }) => h("div", { class: `w-[100px] ${classColumn}`, title: row.getValue("title") }, row.getValue("title")),
  },
  {
    accessorKey: "url",
    header: ({ column }) => getSortedHeader(column, 'Ссылка'),
    cell: ({ row }) => h("div", { class: `w-[100px] ${classColumn}`, title: row.getValue("url") }, row.getValue("url")),
  },
  {
    accessorKey: "thumbnailUrl",
    header: ({ column }) => getSortedHeader(column, 'Миниатюра'),
    cell: ({ row }) => h("div", { class: `w-[100px] ${classColumn}`, title: row.getValue("thumbnailUrl") }, row.getValue("thumbnailUrl")),
  }
];

const columnFilters = ref([]);
const columnVisibility = ref({});
const rowSelection = ref({});
const expanded = ref({});

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});

const onScroll = async ({ target }) => {
  const scrollTop = target.scrollTop;
  const pointHeight = target.scrollHeight - target.offsetHeight;
  if (scrollTop >= pointHeight) {
    tableScrollTop.value = scrollTop;
    await photoStore.nextPage();
  }
};

const onSearch = () => {
  setScrollTop(0);
};

const onSorted = (column) => {
  if (sorted.value.field === column.id) {
    sorted.value.operation = sorted.value.operation === 1 ? 0 : 1;
  } else {
    sorted.value.field = column.id;
    sorted.value.operation = 0;
  }
  photoStore.sortedPhotos(sorted.value);
  setScrollTop(0);
};

const setScrollTop = (value) => {
  const table = document.querySelector('[data-slot=table-container]');
  if (!table) {
    return;
  }
  table.scrollTop = tableScrollTop.value;
}
watch(loading, async (value) => {
  if (!value) {
    await nextTick();
    setScrollTop(tableScrollTop.value);
  }
});
</script>
