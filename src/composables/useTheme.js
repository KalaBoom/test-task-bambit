import { ref } from "vue";

export const useTheme = () => {
  const isDark = ref(false);

  const toggleTheme = () => {
    const root = document.querySelector(":root");

    isDark.value = !isDark.value;

    root.classList.toggle("dark");
  };

  return {
    isDark,
    toggleTheme,
  };
};
