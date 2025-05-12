import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "lib/utils";

const TabsPrim = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-x-2 rounded-full bg-panel/20 px-4 py-1.5 ring-mint backdrop-blur backdrop-opacity-[.12] focus:outline-1",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-full border-none px-8 py-1.5 font-semibold ring-white transition-all focus:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-panel data-[state=active]:backdrop-blur data-[state=active]:backdrop-opacity-[.12]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export interface TabData {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabData[];
  defaultValue?: string;
}

function Tabs({ tabs, defaultValue }: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultValue || tabs[0]?.value
  );
  return (
    <TabsPrim
      defaultValue={defaultValue}
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative z-10"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="relative mt-6">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {tab.content}
            </motion.div>
          </TabsContent>
        ))}
      </div>
    </TabsPrim>
  );
}

export default React.memo(Tabs);
