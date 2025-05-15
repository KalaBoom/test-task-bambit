<template>
  <header class="flex justify-between items-center h-[50px] px-5 bg-accent shadow border-b border-border">
    <div class="flex gap-1 items-center">
      <img src="@/assets/images/logo.webp" class="w-7 h-7" />
      <span class="text-accent-foreground text-2xl">Просмотр фото</span>
    </div>
    <PhotoHeaderThemeSwitch />
  </header>
</template>

<script setup>
import PhotoHeaderThemeSwitch from "@/components/PhotoHeader/PhotoHeaderThemeSwitch.vue";
import PhotoHeaderSearch from "@/components/PhotoTable/PhotoTableSearch.vue";
</script>
