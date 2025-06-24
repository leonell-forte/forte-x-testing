"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { HiChevronDown } from "react-icons/hi";

import { cn } from "@/lib/utils";

import "./Accordion.css";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={className} {...props} />
));

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 transition-all [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <HiChevronDown className="text-icon h-6 w-6 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="accordion-content overflow-hidden"
    {...props}
  >
    <div className={cn("pb-4 pt-2", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

type Props = {
  /** Text or element to display as trigger for the accordion. */
  text: React.ReactNode;
  /** Text or element to display inside the accordion */
  children: React.ReactNode;
  /** Set to true if accordion should be open by default */
  defaultOpen?: boolean;
};

export default function Accordion({
  text,
  children,
  defaultOpen = false,
}: Props) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      {...(defaultOpen && { defaultValue: "item" })}
    >
      <AccordionItem value="item">
        <AccordionTrigger>{text}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </AccordionPrimitive.Root>
  );
}
