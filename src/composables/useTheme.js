import { ref } from "vue";
import { LOCAL_STORAGE_THEME } from "@/config";

export const useTheme = () => {
  const isDark = ref(false);

  const toggleTheme = () => {
    const root = document.querySelector(":root");

    isDark.value = !isDark.value;

    root.classList.toggle("dark");
    saveInStorage()
  };

  const saveInStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_THEME, isDark.value);
  }
    
  const getFromStorage = () => {
    return localStorage.getItem(LOCAL_STORAGE_THEME);
  };

  const initTheme = () => {
    const theme = getFromStorage();
    if (theme) {
      toggleTheme();
    }
  };

  initTheme();

  return {
    isDark,
    toggleTheme,
  };
};
