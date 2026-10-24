// Globals the checks set on the page under test.
interface Window {
  __marker?: number
  __inlineRan?: boolean
  __violation?: (text: string) => void
}
