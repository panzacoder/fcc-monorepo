import React from 'react'
import { TextInput } from 'react-native'

import { cn } from 'primitives'

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'web:flex native:h-12 web:w-full border-input bg-background web:py-2 native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground ring-offset-background focus-visible:ring-ring h-10 rounded-md border px-3 text-sm file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        props.editable === false && 'web:cursor-not-allowed opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
