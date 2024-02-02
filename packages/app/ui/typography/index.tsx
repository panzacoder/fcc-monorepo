'use client'

import { clsx } from 'clsx'
import { ComponentProps, forwardRef } from 'react'
import { Text, Platform, Linking, Role } from 'react-native'
import { TextLink as SolitoTextLink } from 'solito/link'
import { cn } from '../utils'
import { MotiLink } from 'solito/moti'

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

/**
 * This is a more advanced component with custom styles and per-platform functionality
 */
export interface AProps extends ComponentProps<typeof Text> {
  href?: string
  target?: '_blank'
}

export const A = forwardRef<Text, AProps>(function A(
  { className = '', href, target, ...props },
  ref
) {
  const nativeAProps = Platform.select<Partial<AProps>>({
    web: {
      href,
      target,
      hrefAttrs: {
        rel: 'noreferrer',
        target
      }
    },
    default: {
      onPress: (event) => {
        props.onPress && props.onPress(event)
        if (Platform.OS !== 'web' && href !== undefined) {
          Linking.openURL(href)
        }
      }
    }
  })

  return (
    <Text
      role="link"
      className={`text-blue-500 hover:underline ${className}`}
      {...props}
      {...nativeAProps}
      ref={ref}
    />
  )
})

type TextLinkProps = ComponentProps<typeof SolitoTextLink>
export const TextLink = ({ className, children, ...props }: TextLinkProps) => {
  const defaultClassName =
    'text-bae font-bold hover:underline text-blue-500 max-h-full'
  return (
    <SolitoTextLink {...props}>
      <Typography className={clsx(defaultClassName, className)}>
        {children}
      </Typography>
    </SolitoTextLink>
  )
}

type AnimatedLinkProps = ComponentProps<typeof MotiLink> & {
  className?: string
  children: string
}
export const AnimatedLink = ({
  className,
  children,
  ...props
}: AnimatedLinkProps) => {
  const defaultClassName =
    'text-bae font-bold hover:underline text-blue-500 max-h-full'
  return (
    <MotiLink
      animate={({ hovered, pressed }) => {
        'worklet'

        return {
          scale: pressed ? 0.95 : hovered ? 1.1 : 1,
          rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg'
        }
      }}
      transition={{
        type: 'timing',
        duration: 150
      }}
      {...props}
    >
      <Typography className={clsx(defaultClassName, className)}>
        {children}
      </Typography>
    </MotiLink>
  )
}
