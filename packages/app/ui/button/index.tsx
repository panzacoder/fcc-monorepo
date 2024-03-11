import { Pressable, PressableProps } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { ComponentProps } from 'react'

const buttonVariants = tv({
  slots: {
    button:
      'web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 ring-offset-background group flex-row items-center justify-center gap-1 rounded-full active:opacity-90 disabled:pointer-events-none disabled:opacity-50',
    text: 'text-md px-1 font-bold disabled:pointer-events-none disabled:opacity-50',
    icon: 'color-primary'
  },
  variants: {
    variant: {
      default: {
        button: 'bg-primary hover:bg-primary/90 shadow active:opacity-90',
        text: 'text-primary-foreground',
        icon: 'color-primary-foreground'
      },
      destructive: {
        button: 'bg-destructive hover:bg-destructive/90 shadow-sm',
        text: 'text-destructive-foreground',
        icon: 'color-destructive-foreground'
      },
      outline: {
        button:
          'text-primary-foreground border-primary hover:bg-accent border  ',
        text: 'text-primary group-hover:text-accent-foreground',
        icon: 'hover:color-accent-foreground'
      },
      secondary: {
        button: 'bg-secondary hover:bg-secondary/80',
        text: 'text-secondary-foreground',
        icon: 'color-secondary-foreground'
      },
      ghost: {
        button: 'hover:bg-accent',
        text: 'text-secondary group-hover:text-accent-foreground',
        icon: 'color-secondary group-hover:color-accent-foreground'
      },
      accent: {
        button: 'bg-accent hover:bg-accent/90',
        text: 'text-accent-foreground',
        icon: 'color-accent-foreground'
      },

      link: {
        button: '',
        text: 'text-primary group-hover:underline',
        icon: 'color-primary'
      },
      'link-secondary': {
        button: '',
        text: 'text-secondary group-hover:underline',
        icon: 'color-secondary'
      },
      border: {
        button: 'border-primary border-[2px]',
        text: 'text-primary '
      }
    },
    iconOnly: {
      true: {
        button: 'p-2',
        text: 'hidden'
      }
    },
    size: {
      default: { button: 'h-10 px-4 py-2' },
      sm: { button: 'h-9 px-3 py-1' },
      lg: { button: 'h-11 px-8' },
      icon: { button: 'h-10 w-10' }
    },
    disabled: {
      true: {
        button: 'pointer-events-none bg-gray-300 opacity-50 shadow-none',
        text: 'text-gray-900'
      }
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
  disabled = false,
  leadingIcon,
  trailingIcon,
  typographyClassName,
  iconOnly
}: ButtonProps) => {
  const { button, text, icon } = buttonVariants({
    variant,
    size: iconOnly ? 'icon' : size,
    disabled,
    iconOnly
  })
  return (
    <Pressable onPress={onPress} className={button({ className })}>
      {leadingIcon && (
        <Feather name={leadingIcon} size={16} className={icon()} />
      )}
      <Typography
        className={text({
          className: typographyClassName
        })}
      >
        {title}
      </Typography>
      {trailingIcon && (
        <Feather name={trailingIcon} size={16} className={icon()} />
      )}
    </Pressable>
  )
}
