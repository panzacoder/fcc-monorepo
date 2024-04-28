'use client'

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
        button: 'bg-primary hover:bg-primary/90 active:bg-primary/90 shadow',
        text: 'text-primary-foreground',
        icon: 'color-primary-foreground'
      },
      primary: {
        button: 'bg-primary hover:bg-primary/90 active:bg-primary/90 shadow',
        text: 'text-primary-foreground',
        icon: 'color-primary-foreground'
      },
      light: {
        button:
          'bg-background hover:bg-background/90 active:bg-background/90 shadow',
        text: 'text-foreground',
        icon: 'color-foreground'
      },
      destructive: {
        button:
          'bg-destructive hover:bg-destructive/90 active:bg-destructive/90 shadow',
        text: 'text-destructive-foreground',
        icon: 'color-destructive-foreground'
      },
      outline: {
        button: 'border-primary hover:bg-accent active:bg-accent border  ',
        text: 'text-primary group-hover:text-accent-foreground group-active:text-accent-foreground',
        icon: ' group-hover:color-accent-foreground group-active:color-accent-foreground'
      },
      'outline-destructive': {
        button:
          'border-destructive hover:bg-destructive/90 active:bg-destructive/80 border',
        text: 'text-destructive group-hover:text-destructive-foreground group-active:text-destructive-foreground',
        icon: 'group-hover:color-destructive-foreground group-active:text-destructive-foreground'
      },
      secondary: {
        button: 'bg-secondary hover:bg-secondary/80 active:bg-secondary/90',
        text: 'text-secondary-foreground group-hover:text-secondary-foreground group-active:text-secondary-foreground',
        icon: 'color-secondary-foreground group-hover:color-secondary-foreground group-active:color-secondary-foreground'
      },
      ghost: {
        button: 'hover:bg-primary active:bg-primary/80',
        text: 'text-primary group-hover:text-primary-foreground group-active:text-primary-foreground',
        icon: 'color-primary group-hover:color-primary-foreground group-active:color-primary-foreground'
      },
      'ghost-secondary': {
        button: 'hover:bg-secondary active:bg-secondary/80',
        text: 'text-secondary group-hover:text-secondary-foreground group-active:text-secondary-foreground',
        icon: 'color-secondary group-hover:color-secondary-foreground group-active:color-secondary-foreground'
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
      'link-destructive': {
        button: '',
        text: 'text-destructive group-hover:underline',
        icon: 'color-destructive'
      },
      border: {
        button: 'border-primary border-[2px]',
        text: 'text-primary '
      },
      borderRed: {
        button: 'border-[2px] border-[#E43A39]',
        text: 'text-primary text-[#E43A39]'
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
    variant: 'primary',
    size: 'default'
  }
})

export type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    title?: string
    typographyClassName?: string
    leadingIcon?: ComponentProps<typeof Feather>['name']
    trailingIcon?: ComponentProps<typeof Feather>['name']
    children?: React.ReactNode
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
  iconOnly,
  children,
  ...rest
}: ButtonProps) => {
  const { button, text, icon } = buttonVariants({
    variant,
    size: iconOnly ? 'icon' : size,
    disabled,
    iconOnly
  })
  return (
    <Pressable onPress={onPress} className={button({ className })} {...rest}>
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
      {children}
      {trailingIcon && (
        <Feather name={trailingIcon} size={16} className={icon()} />
      )}
    </Pressable>
  )
}
