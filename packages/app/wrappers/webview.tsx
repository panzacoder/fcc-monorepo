import { WebView as RNWebView } from 'react-native-webview'

const baseURL = 'http://localhost:3000'
export default function WebView({ path }) {
  return (
    <RNWebView
      source={{
        uri: new URL(path || '404', baseURL).toString()
      }}
    />
  )
}
