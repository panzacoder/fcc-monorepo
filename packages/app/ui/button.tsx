// import { vars, useColorScheme } from 'nativewind'
import { Pressable, PressableProps } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { Typography } from './typography'
import { cn } from './utils'

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-full text-sm font-medium active:opacity-90 web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',

  {
    variants: {
      variant: {
        default: 'bg-primary shadow hover:bg-primary/90 active:opacity-90',
        destructive: 'bg-destructive shadow-sm hover:bg-destructive/90',
        outline:
          'text-primary-foreground border border-input shadow-sm  hover:bg-accent ',
        secondary: 'bg-secondary  hover:bg-secondary/80',
        ghost: 'hover:bg-accent',
        link: 'underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const buttonTextVariants = cva(
  'text-sm font-medium disabled:opacity-50 disabled:pointer-events-none ',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'text-primary hover:text-accent-foreground',
        secondary: 'text-secondary-foreground',
        ghost: 'text-secondary hover:text-accent-foreground',
        link: 'text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    title?: string
    children?: React.ReactNode
    typographyClassName?: string
  }

const Button = ({
  title,
  children,
  onPress,
  className = '',
  variant = 'default',
  size = 'default',
  typographyClassName,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(buttonVariants({ variant, size, className }))}
    >
      {children ?? (
        <Typography
          className={cn(
            buttonTextVariants({
              variant,
              className: typographyClassName,
            }),
          )}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  )
}

export default Button
