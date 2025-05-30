
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface AnimatedTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTabs({ value, onValueChange, children, className }: AnimatedTabsProps) {
  return (
    <Tabs 
      value={value} 
      onValueChange={onValueChange} 
      className={cn("space-y-6", className)}
    >
      {children}
    </Tabs>
  );
}

interface AnimatedTabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTabsList({ children, className }: AnimatedTabsListProps) {
  return (
    <TabsList className={cn(
      "grid w-full transition-all duration-300 ease-in-out",
      "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm",
      "border border-gray-200 dark:border-gray-700",
      className
    )}>
      {children}
    </TabsList>
  );
}

interface AnimatedTabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTabsTrigger({ value, children, className }: AnimatedTabsTriggerProps) {
  return (
    <TabsTrigger 
      value={value}
      className={cn(
        "flex items-center transition-all duration-200 ease-in-out",
        "hover:scale-105 hover:shadow-sm",
        "data-[state=active]:bg-ocean data-[state=active]:text-white",
        "data-[state=active]:shadow-md data-[state=active]:scale-105",
        "text-sm font-medium",
        className
      )}
    >
      {children}
    </TabsTrigger>
  );
}

interface AnimatedTabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTabsContent({ value, children, className }: AnimatedTabsContentProps) {
  return (
    <TabsContent 
      value={value}
      className={cn(
        "animate-in fade-in-50 slide-in-from-bottom-4 duration-300",
        "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-50",
        className
      )}
    >
      {children}
    </TabsContent>
  );
}
