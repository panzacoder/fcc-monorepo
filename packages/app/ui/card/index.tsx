import { ScrollView, View } from 'react-native'
import { cn } from 'app/ui/utils'

export type CardProps = {
  children: React.ReactNode
  className?: string
  scroll?: boolean
}

export function Card({ children, scroll, className = '' }: CardProps) {
  const ViewComponent = scroll ? ScrollView : View
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <ViewComponent
        className={cn(
          'bg-card flex flex-shrink rounded-2xl px-6 pb-1 pt-5',
          className
        )}
      >
        {children}
      </ViewComponent>
    </ScrollView>
  )
}
