'use client'

import { ComponentProps, forwardRef } from 'react'
import { Text, Role } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

const typographyVariants = tv({
  base: 'text-base text-black',
  variants: {
    variant: {
      h1: 'text-5xl font-extrabold',
      h2: 'text-4xl font-extrabold',
      h3: 'text-3xl font-bold',
      h4: 'text-xl font-bold',
      h5: 'font-bold',
      h6: 'text-sm font-bold',
      p: '',
      span: '',
      strong: 'font-bold',
      em: 'italic',
      small: 'text-sm',
      a: 'text-blue-500 hover:underline',
      blockquote: 'border-l-4 border-gray-400 pl-4 italic'
    }
  }
})

const variantProps = {
  h1: {
    'aria-level': 1,
    role: 'heading'
  },
  h2: {
    'aria-level': 2,
    role: 'heading'
  },
  h3: { 'aria-level': 3, role: 'heading' },
  h4: { 'aria-level': 4, role: 'heading' },
  h5: {
    'aria-level': 5,
    role: 'heading'
  },
  h6: { 'aria-level': 6, role: 'heading' },
  p: {},
  span: {},
  strong: {},
  em: {},
  small: {},
  a: {},
  blockquote: {}
}

type defaultTextProps = {
  'aria-level'?: number
  role?: Role
}

type TypographyVariants = VariantProps<typeof typographyVariants>

export type TypographyProps = ComponentProps<typeof Text> &
  TypographyVariants & {
    as?: TypographyVariants['variant']
    target?: string // added for compat with web links
  }
export const Typography = forwardRef<Text, TypographyProps>(function Typography(
  { variant = 'p', as = variant, className, ...props },
  ref
) {
  const defaults = variantProps[as] as defaultTextProps
  return (
    <Text
      className={typographyVariants({ variant, className })}
      {...defaults}
      {...props}
      ref={ref}
    />
  )
})
