"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  activeValue?: string
  variant: "segmented" | "underline"
  fullWidth: boolean
}>({
  activeValue: undefined,
  variant: "segmented",
  fullWidth: false,
})

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: "segmented" | "underline"
  fullWidth?: boolean
}

function Tabs({
  className,
  variant = "segmented",
  fullWidth = false,
  onValueChange,
  ...props
}: TabsProps) {
  const [value, setValue] = React.useState<string | undefined>(props.defaultValue || props.value)

  // Sync internal state with prop if controlled
  React.useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value)
    }
  }, [props.value])

  const handleValueChange = (newValue: string) => {
    if (props.value === undefined) {
      setValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      onValueChange={handleValueChange}
      value={value}
      {...props}
    >
      <TabsContext.Provider value={{ activeValue: value, variant, fullWidth }}>
        {props.children}
      </TabsContext.Provider>
    </TabsPrimitive.Root>
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  const { fullWidth } = React.useContext(TabsContext)

  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground bg-muted/50",
        "no-scrollbar max-w-full", // Responsive scrolling
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  value,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  const { activeValue, variant, fullWidth } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "group relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-foreground z-10",
        fullWidth && "flex-1",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab-indicator"
          className={cn(
            "absolute inset-0 z-[-1]",
            variant === "segmented" && "bg-background shadow-sm rounded-md",
            variant === "underline" && "bottom-0 h-[2px] bg-primary rounded-none top-auto"
          )}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      {/* Hover Ghost Effect */}
      {!isActive && (
        <div className="absolute inset-0 z-[-2] rounded-md bg-muted opacity-0 transition-opacity group-hover:opacity-50" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
