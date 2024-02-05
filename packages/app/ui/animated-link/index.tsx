import { cn } from 'app/ui/utils'
import { ComponentProps } from 'react'
import { MotiLink } from 'solito/moti'
import { Typography } from 'app/ui/typography'

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
      <Typography className={cn(defaultClassName, className)}>
        {children}
      </Typography>
    </MotiLink>
  )
}
