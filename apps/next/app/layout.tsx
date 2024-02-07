/** @jsxImportSource react */
import 'raf/polyfill'
import 'setimmediate'
import 'app/config/tailwind/global.css'

import { Provider } from 'app/provider'
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
