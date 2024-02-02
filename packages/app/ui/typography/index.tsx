import { ComponentProps } from 'react'
import { Text, Role } from 'react-native'
import { cn } from '../utils'

type defaultTextProps = {
  className: string
  ariaLevel?: number
  role?: Role
}
const variantDefaultClassNames = {
  h1: {
    className: 'text-5xl font-extrabold',
    ariaLevel: 1,
    role: 'heading'
  },
  h2: {
    className: 'text-4xl font-extrabold',
    ariaLevel: 2,
    role: 'heading'
  },
  h3: { className: 'text-3xl font-bold', ariaLevel: 3, role: 'heading' },
  h4: { className: 'text-xl font-bold', ariaLevel: 4, role: 'heading' },
  h5: {
    className: 'text-base font-bold',
    ariaLevel: 5,
    role: 'heading'
  },
  h6: { className: 'text-sm font-bold', ariaLevel: 6, role: 'heading' },
  p: { className: 'text-base text-black' },
  span: { className: 'text-base text-black' },
  strong: { className: 'text-base font-bold' },
  em: { className: 'text-base italic' },
  small: { className: 'text-sm text-black' },
  a: { className: 'text-blue-500 hover:underline' },
  blockquote: {
    className: 'text-base italic border-l-4 border-gray-400 pl-4'
  }
}

export type TypographyProps = ComponentProps<typeof Text> & {
  variant?: keyof typeof variantDefaultClassNames
  as?: keyof typeof variantDefaultClassNames
}
export const Typography = ({
  variant = 'p',
  as = variant,
  className,
  ...props
}: TypographyProps) => {
  const defaults = variantDefaultClassNames[variant] as defaultTextProps
  return (
    <>
      <Text
        className={cn(defaults.className, className)}
        aria-level={defaults?.ariaLevel}
        role={defaults?.role}
        {...props}
      />
    </>
  )
}
