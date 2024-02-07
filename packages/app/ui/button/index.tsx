import { Pressable, PressableProps } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { ComponentProps } from 'react'

const buttonVariants = tv({
  slots: {
    button:
      'web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 ring-offset-background flex-row items-center justify-center gap-1 rounded-full active:opacity-90 disabled:pointer-events-none disabled:opacity-50',
    text: 'text-md px-1 font-bold disabled:pointer-events-none disabled:opacity-50'
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
          'text-primary-foreground border-input hover:bg-accent border shadow-sm ',
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
        button: 'hover:underline',
        text: 'text-primary '
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
    typographyClassName?: string
    leadingIcon?: ComponentProps<typeof Feather>['name']
    trailingIcon?: ComponentProps<typeof Feather>['name']
  }

export const Button = ({
  title,
  onPress,
  className = '',
  variant = 'default',
  size = 'default',
  leadingIcon,
  trailingIcon,
  typographyClassName
}: ButtonProps) => {
  const { button, text } = buttonVariants({ variant, size })
  return (
    <Pressable onPress={onPress} className={button({ className })}>
      {leadingIcon && (
        <Feather name={leadingIcon} size={16} color="white" className="" />
      )}
      <Typography
        className={text({
          className: typographyClassName
        })}
      >
        {title}
      </Typography>
      {trailingIcon && (
        <Feather name={trailingIcon} size={16} color="white" className="" />
      )}
    </Pressable>
  )
}
