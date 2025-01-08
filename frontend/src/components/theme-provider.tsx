"use client"

import * as React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      enableColorScheme={true}
      storageKey="ai-tools-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}