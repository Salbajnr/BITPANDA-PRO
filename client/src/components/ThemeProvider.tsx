import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setMounted(true);
      const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
      setTheme(savedTheme);
      
      // Apply theme immediately
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(savedTheme);
      
      // Set color-scheme for better browser integration
      document.documentElement.style.colorScheme = savedTheme;
    } catch (error) {
      console.error('ThemeProvider initialization error:', error);
      // Fallback to light theme
      setTheme("light");
      setMounted(true);
    }
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      
      // Remove old theme and add new one
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
      document.documentElement.style.colorScheme = newTheme;
    } catch (error) {
      console.error('Theme toggle error:', error);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
