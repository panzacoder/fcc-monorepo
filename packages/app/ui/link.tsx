import { Text, Platform, Linking } from 'react-native'
import { TextLink as SolitoTextLink } from 'solito/link'
import { cn } from './utils'
import { ComponentProps, forwardRef } from 'react'
import { MotiLink } from 'solito/moti'
import Typography from './typography'

/**
 * This is a more advanced component with custom styles and per-platform functionality
 */
export interface AProps extends ComponentProps<typeof Text> {
  href?: string
  target?: '_blank'
}
export const A = forwardRef<Text, AProps>(function A(
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
export const TextLink = ({ className, children, ...props }: TextLinkProps) => {
  const defaultClassName =
    'text-bae font-bold hover:underline text-blue-500 max-h-full'
  return (
    <SolitoTextLink {...props}>
      <Typography className={cn(defaultClassName, className)}>
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
          rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
        }
      }}
      transition={{
        type: 'timing',
        duration: 150,
      }}
      {...props}
    >
      <Typography className={cn(defaultClassName, className)}>
        {children}
      </Typography>
    </MotiLink>
  )
}
