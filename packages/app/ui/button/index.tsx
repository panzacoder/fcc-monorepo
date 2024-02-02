import { Pressable, PressableProps } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'
import { Typography } from '../typography'

const buttonVariants = tv({
  slots: {
    button:
      'web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 ring-offset-background flex-row items-center justify-center rounded-full text-sm font-medium active:opacity-90 disabled:pointer-events-none disabled:opacity-50',
    text: 'text-sm font-medium disabled:pointer-events-none disabled:opacity-50'
  },
  variants: {
    variant: {
      default: {
        button: 'bg-primary hover:bg-primary/90 shadow active:opacity-90',
        text: 'text-primary-foreground'
      },
      destructive: {
        button: 'bg-destructive hover:bg-destructive/90 shadow-sm',
        text: 'text-destructive-foreground'
      },
      outline: {
        button:
          'text-primary-foreground border-input hover:bg-accent border  shadow-sm ',
        text: 'text-primary hover:text-accent-foreground'
      },
      secondary: {
        button: 'bg-secondary hover:bg-secondary/80',
        text: 'text-secondary-foreground'
      },
      ghost: {
        button: 'hover:bg-accent',
        text: 'text-secondary hover:text-accent-foreground'
      },
      link: {
        button: 'underline-offset-4 hover:underline',
        text: 'text-primary'
      }
    },
    size: {
      default: { button: 'h-10 px-4 py-2' },
      sm: { button: 'h-9 px-3 py-1' },
      lg: { button: 'h-11 px-8' },
      icon: { button: 'h-10 w-10' }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

export type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    title?: string
    children?: React.ReactNode
    typographyClassName?: string
  }

export const Button = ({
  title,
  children,
  onPress,
  className = '',
  variant = 'default',
  size = 'default',
  typographyClassName
}: ButtonProps) => {
  const { button, text } = buttonVariants({ variant, size })
  return (
    <Pressable onPress={onPress} className={button({ className })}>
      {children ?? (
        <Typography
          className={text({
            className: typographyClassName
          })}
        >
          {title}
        </Typography>
      )}
    </Pressable>
  )
}
