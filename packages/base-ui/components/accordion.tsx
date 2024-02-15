import * as React from 'react'
import { AccordionPrimitive } from 'primitives'

import { ChevronDown } from 'lucide-react-native'
import { Platform, View } from 'react-native'
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming
} from 'react-native-reanimated'
import { cn } from 'app/lib/utils'

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ children, ...props }, ref) => {
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        ref={ref}
        {...props}
        asChild={Platform.OS !== 'web'}
      >
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  )
})

Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, value, ...props }, ref) => {
  return (
    <Animated.View
      className={'overflow-hidden'}
      layout={LinearTransition.duration(200)}
    >
      <AccordionPrimitive.Item
        ref={ref}
        className={cn('border-border border-b', className)}
        value={value}
        {...props}
      />
    </Animated.View>
  )
})
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext()

  const progress = useDerivedValue(() =>
    isExpanded
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 200 })
  )
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
    opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP)
  }))

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger ref={ref} {...props} asChild>
        <View
          className={cn(
            'web:flex-1 focus-visible:ring-muted-foreground group flex flex-row items-center justify-between rounded-md py-4 transition-all focus-visible:outline-none focus-visible:ring-1',
            className
          )}
        >
          <>{children}</>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={18} className={'text-foreground shrink-0'} />
          </Animated.View>
        </View>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext()
  return (
    <AccordionPrimitive.Content
      className={cn(
        'web:transition-all overflow-hidden text-sm',
        isExpanded ? 'web:animate-accordion-down' : 'web:animate-accordion-up'
      )}
      ref={ref}
      {...props}
    >
      <InnerContent className={cn('pb-4', className)}>{children}</InnerContent>
    </AccordionPrimitive.Content>
  )
})

function InnerContent({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  if (Platform.OS === 'web') {
    return <View className={cn('pb-4', className)}>{children}</View>
  }
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp.duration(200)}
      className={cn('pb-4', className)}
    >
      {children}
    </Animated.View>
  )
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
