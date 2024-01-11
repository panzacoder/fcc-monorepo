import { clsx } from 'clsx'
import { ComponentProps, forwardRef } from 'react'
import { Text as NativeText, Platform, Linking } from 'react-native'
import { TextLink as SolitoTextLink } from 'solito/link'

export const Text = NativeText
/**
 * You can use this pattern to create components with default styles
 */
export const P = ({ className, ...props }) => (
  <Text className={clsx('my-4 text-base text-black', className)} {...props} />
)

/**
 * Components can have defaultProps and styles
 */

export const H1 = ({ className, ...props }) => (
  <Text
    className={clsx('my-4 text-3xl font-extrabold', className)}
    {...props}
  />
)
H1.defaultProps = {
  'aria-level': 1,
  role: 'heading',
}

export const H2 = ({ className, ...props }) => (
  <Text
    className={clsx('my-4 text-2xl font-extrabold', className)}
    {...props}
  />
)
H2.defaultProps = {
  'aria-level': 2,
  role: 'heading',
}

export const H3 = ({ className, ...props }) => (
  <Text className={clsx('my-4 text-xl font-bold', className)} {...props} />
)
H3.defaultProps = {
  'aria-level': 3,
  role: 'heading',
}

export const H4 = ({ className, ...props }) => (
  <Text className={clsx('my-4 text-lg font-bold', className)} {...props} />
)
H4.defaultProps = {
  'aria-level': 4,
  role: 'heading',
}

/**
 * This is a more advanced component with custom styles and per-platform functionality
 */
export interface AProps extends ComponentProps<typeof Text> {
  href?: string
  target?: '_blank'
}

export const A = forwardRef<NativeText, AProps>(function A(
  { className = '', href, target, ...props },
  ref,
) {
  const nativeAProps = Platform.select<Partial<AProps>>({
    web: {
      href,
      target,
      hrefAttrs: {
        rel: 'noreferrer',
        target,
      },
    },
    default: {
      onPress: (event) => {
        props.onPress && props.onPress(event)
        if (Platform.OS !== 'web' && href !== undefined) {
          Linking.openURL(href)
        }
      },
    },
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
export const TextLink = ({ className, ...props }: TextLinkProps) => {
  const defaultClassName = 'text-bae font-bold hover:underline text-blue-500'
  return (
    <SolitoTextLink className={clsx(defaultClassName, className)} {...props} />
  )
}
