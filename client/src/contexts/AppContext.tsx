import { createContext, ReactNode, useEffect, useState } from "react"
import { fetchAppSettings, AppSettings } from "@/api/settings"

interface AppContextType extends AppSettings {
  isLoading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

export const AppContext = createContext<AppContextType>({
  isLoading: false,
  error: null,
  refreshSettings: async () => {},
})

const AppProvider = ({children}: {children: ReactNode}) => {
  const [values, setValues] = useState<AppSettings>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const settings = await fetchAppSettings()
      setValues(settings)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف في جلب الإعدادات'
      setError(errorMessage)
      console.error('❌ فشل في جلب إعدادات الموقع:', errorMessage)
      
      setValues({
        title: 'RS Pharm',
        desc: 'متجر المنتجات الصحية',
        store: {
          currency: 'DZD'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const contextValue: AppContextType = {
    ...values,
    isLoading,
    error,
    refreshSettings
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
