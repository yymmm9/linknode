import { useRouter } from 'next/navigation'

export function redirectWithLocale(path: string, locale?: string) {
  console.group('🌐 Redirect Locale Processing')
  console.log('Input Path:', path)
  console.log('Requested Locale:', locale)

  try {
    // If we're on the client side, we can get the current locale from the URL
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      console.log('Current Window Path:', currentPath)

      const currentLocale = currentPath.split('/')[1] || 'en'
      console.log('Detected Current Locale:', currentLocale)

      const targetLocale = locale || currentLocale
      console.log('Target Locale:', targetLocale)

      // Remove any leading slashes and add locale prefix
      const cleanPath = path.replace(/^\/+/, '')
      const fullPath = `/${targetLocale}/${cleanPath}`
      
      console.log('Final Redirect Path:', fullPath)
      console.groupEnd()
      
      return fullPath
    }
    
    // If we're on the server side, default to 'en'
    const serverFallbackPath = `/en/${path.replace(/^\/+/, '')}`
    console.log('Server-side Fallback Path:', serverFallbackPath)
    console.groupEnd()
    
    return serverFallbackPath
  } catch (error) {
    console.error('❌ Redirect Locale Processing Error:', error)
    console.groupEnd()
    return `/en/${path.replace(/^\/+/, '')}`
  }
}

export function useRedirect() {
  const router = useRouter()
  
  return {
    redirect: (path: string, locale?: string) => {
      console.group('🚦 Redirect Execution')
      console.log('Redirect Input Path:', path)
      console.log('Redirect Input Locale:', locale)

      try {
        const fullPath = redirectWithLocale(path, locale)
        console.log('Executing Router Push:', fullPath)
        router.push(fullPath)
        console.groupEnd()
      } catch (error) {
        console.error('❌ Redirect Execution Error:', error)
        console.groupEnd()
      }
    }
  }
}
