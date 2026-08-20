import { onMounted, onUnmounted, ref } from 'vue'

/** True when viewport should use the phone shell */
export function useIsMobile(query = '(max-width: 767px)') {
  const isMobile = ref(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  onMounted(() => {
    const mql = window.matchMedia(query)
    const sync = () => {
      isMobile.value = mql.matches
    }
    sync()
    mql.addEventListener('change', sync)
    onUnmounted(() => mql.removeEventListener('change', sync))
  })

  return isMobile
}
