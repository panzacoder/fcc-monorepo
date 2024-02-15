import { X } from 'lucide-react-native'
import * as React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { cn, DialogPrimitive } from 'primitives'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlayWeb = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { open } = DialogPrimitive.useContext()
  return (
    <DialogPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn(
        'z-50 flex items-center justify-center bg-black/80 p-2',
        open ? 'animate-in fade-in-0' : 'animate-out fade-out-0',
        className
      )}
      {...props}
      ref={ref}
    />
  )
})

DialogOverlayWeb.displayName = 'DialogOverlayWeb'

const DialogOverlayNative = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => {
  return (
    <Animated.View
      style={StyleSheet.absoluteFill}
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
    >
      <DialogPrimitive.Overlay
        style={StyleSheet.absoluteFill}
        className={cn(
          'z-50 flex items-center justify-center bg-black/80 p-2',
          className
        )}
        {...props}
        ref={ref}
      >
        <>{children}</>
      </DialogPrimitive.Overlay>
    </Animated.View>
  )
})

DialogOverlayNative.displayName = 'DialogOverlayNative'

const DialogOverlay = Platform.select({
  web: DialogOverlayWeb,
  default: DialogOverlayNative
})

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { open } = DialogPrimitive.useContext()
  return (
    <DialogPortal>
      <DialogOverlay style={StyleSheet.absoluteFill}>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'border-border web:cursor-default bg-background web:duration-200 z-50 max-w-lg gap-4 rounded-lg border p-6 shadow-lg',
            open
              ? 'web:animate-in web:fade-in-0 web:zoom-in-95'
              : 'web:animate-out web:fade-out-0 web:zoom-out-95',
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className={
              'ring-offset-background focus:ring-ring group absolute right-4 top-4 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none'
            }
          >
            <X
              size={Platform.OS === 'web' ? 16 : 18}
              className={cn(
                'text-muted-foreground',
                open && 'text-accent-foreground'
              )}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) => (
  <View
    className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) => (
  <View
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'native:text-xl text-foreground text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('native:text-base text-muted-foreground text-sm', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
