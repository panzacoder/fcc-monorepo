import { Text, Platform, Linking } from 'react-native'
import { TextLink as SolitoTextLink, Link } from 'solito/link'
import { ComponentProps, forwardRef } from 'react'
import { Typography, TypographyProps } from 'app/ui/typography'
import { tv } from 'tailwind-variants'
import { logger } from 'app/utils/logger'

/**
 * This is a more advanced component with custom styles and per-platform functionality
 */
export type ExternalLinkProps = TypographyProps

export const ExternalLink = forwardRef<Text, ExternalLinkProps>(
  function ExternalLink({ href, ...props }, ref) {
    const target = '_blank'
    logger.debug('href', href)
    const nativeAProps = Platform.select<Partial<ExternalLinkProps>>({
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

    return <Typography role="link" {...props} {...nativeAProps} ref={ref} />
  }
)

type InternalLinkProps = ComponentProps<typeof SolitoTextLink>

export const InternalLink = ({
  className,
  children,
  ...props
}: InternalLinkProps) => {
  return (
    <Link {...props}>
      <Typography className={className}>{children}</Typography>
    </Link>
  )
}

type ConditionalTextLinkProps =
  | { external?: boolean }
  | ({ external?: false } & InternalLinkProps)
  | ({ external: true } & ExternalLinkProps)

const linkStyleVariants = tv({
  base: 'text-bae max-h-full font-bold text-blue-500 hover:underline',
  variants: {
    external: {
      true: 'underline',
      false: 'active:underline'
    }
  },
  defaultVariants: {
    external: false
  }
})

export const TextLink = ({
  className,
  external = false,
  ...props
}: ConditionalTextLinkProps & { className?: string }) => {
  const classNames = linkStyleVariants({ external, className })

  if (external) {
    return (
      <ExternalLink {...(props as ExternalLinkProps)} className={classNames} />
    )
  } else {
    return (
      <InternalLink {...(props as InternalLinkProps)} className={classNames} />
    )
  }
}
