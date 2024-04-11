'use client'
import { ScrollView, Text, View } from 'react-native'
import { VariantProps, tv } from 'tailwind-variants'

const cardVariants = tv({
  slots: {
    base: 'flex flex-shrink rounded-2xl px-6 py-4 shadow-xl',
    title: 'text-sm font-bold'
  },
  variants: {
    variant: {
      default: { base: 'bg-card/85', title: 'text-primary-foreground' },
      secondary: {
        base: 'bg-secondary',
        title: 'text-secondary-foreground'
      },
      accent: { base: 'bg-accent', title: 'text-accent-foreground' },
      muted: { base: 'bg-muted/70', title: 'text-secondary/80' },
      glass: { base: 'bg-secondary/20', title: 'text-primary-foreground' },
      destructive: {
        base: 'bg-destructive',
        title: 'text-destructive-foreground'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type CardProps = {
  children: React.ReactNode
  className?: string
  scroll?: boolean
  title?: string
} & VariantProps<typeof cardVariants>

export function Card({
  variant,
  title,
  children,
  scroll,
  className
}: CardProps) {
  const ViewComponent = scroll ? ScrollView : View
  const styles = cardVariants({ variant })

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      className="overflow-visible"
    >
      <ViewComponent className={styles.base({ className })}>
        {title && <Text className={styles.title()}>{title}</Text>}
        {children}
      </ViewComponent>
    </ScrollView>
  )
}
