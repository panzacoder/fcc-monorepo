import { Platform } from 'react-native'
import {
  cn,
  SlotPrimitive as Slot,
  SlottableTextProps,
  TextRef
} from 'primitives'
import * as React from 'react'
import { Text as RNText } from 'react-native'

const TextClassContext = React.createContext<string | undefined>(undefined)

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn(
          'text-foreground web:select-text text-base',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Text.displayName = 'Text'

const H1 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        role="heading"
        aria-level="1"
        className={cn(
          'web:scroll-m-20 text-foreground web:select-text text-4xl font-extrabold tracking-tight lg:text-5xl',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

H1.displayName = 'H1'

const H2 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        role="heading"
        aria-level="2"
        className={cn(
          'web:scroll-m-20 border-border text-foreground web:select-text border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

H2.displayName = 'H2'

const H3 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        role="heading"
        aria-level="3"
        className={cn(
          'web:scroll-m-20 text-foreground web:select-text text-2xl font-semibold tracking-tight',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

H3.displayName = 'H3'

const H4 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        role="heading"
        aria-level="4"
        className={cn(
          'web:scroll-m-20 text-foreground web:select-text text-xl font-semibold tracking-tight',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

H4.displayName = 'H4'

const P = Text

const BlockQuote = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        // @ts-ignore - role of blockquote renders blockquote element on the web
        role={Platform.OS === 'web' ? 'blockquote' : undefined}
        className={cn(
          'native:mt-4 border-border native:pl-3 text-foreground web:select-text mt-6 border-l-2 pl-6 text-base italic',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

BlockQuote.displayName = 'BlockQuote'

const Code = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        // @ts-ignore - role of code renders code element on the web
        role={Platform.OS === 'web' ? 'code' : undefined}
        className={cn(
          'bg-muted text-foreground web:select-text relative rounded-md px-[0.3rem] py-[0.2rem] text-sm font-semibold',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Code.displayName = 'Code'

const Lead = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn(
          'text-muted-foreground web:select-text text-xl',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Lead.displayName = 'Lead'

const Large = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn(
          'text-foreground web:select-text text-xl font-semibold',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Large.displayName = 'Large'

const Small = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn(
          'text-foreground web:select-text text-sm font-medium leading-none',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Small.displayName = 'Small'

const Muted = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn(
          'text-muted-foreground web:select-text text-sm',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Muted.displayName = 'Muted'

export {
  H1,
  H2,
  H3,
  H4,
  P,
  BlockQuote,
  Code,
  Lead,
  Large,
  Small,
  Muted,
  Text,
  TextClassContext
}
