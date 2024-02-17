export function formatUrl(url: string, params: Record<string, string>) {
  const searchString = new URLSearchParams(params).toString()
  return `${url}?${searchString}`
}
