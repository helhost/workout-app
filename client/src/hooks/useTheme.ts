import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved || "system";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(newTheme: Theme) {
    const root = document.documentElement;
    if (newTheme === "system") {
      root.classList.remove("light", "dark");
      // Follow system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    }
  }

  function changeTheme(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  }

  return { theme, changeTheme };
}
