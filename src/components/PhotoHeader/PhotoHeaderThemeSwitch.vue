<template>
  <Switch
    class="data-[state=checked]:bg-primary"
    :checked="isDark"
    @update:checked="toggleTheme"
  >
    <template #thumb>
      <div class="h-full flex items-center justify-center">
        <Icon v-if="isDark" name="Moon" class="size-3 text-white" />
        <Icon v-else name="Sun" class="size-3 text-white" />
      </div>
    </template>
  </Switch>
</template>

<script setup>
import Icon from "@/components/ui/icon/Icon.vue";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
</script>
