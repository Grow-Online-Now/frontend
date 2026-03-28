import { createContext, useContext, useState, useCallback } from 'react'
import type { LimitType, PlanType } from '@/types/subscription'

export interface UpgradePromptState {
  isOpen: boolean
  limitType: LimitType | null
  current: number
  limit: number
  plan: PlanType
}

interface UpgradePromptContextValue {
  state: UpgradePromptState
  showUpgradePrompt: (
    limitType: LimitType,
    current: number,
    limit: number,
    plan: PlanType
  ) => void
  closeUpgradePrompt: () => void
}

const initialState: UpgradePromptState = {
  isOpen: false,
  limitType: null,
  current: 0,
  limit: 0,
  plan: 'FREE',
}

const UpgradePromptContext = createContext<UpgradePromptContextValue | null>(null)

export function UpgradePromptProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UpgradePromptState>(initialState)

  const showUpgradePrompt = useCallback(
    (limitType: LimitType, current: number, limit: number, plan: PlanType) => {
      setState({ isOpen: true, limitType, current, limit, plan })
    },
    []
  )

  const closeUpgradePrompt = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <UpgradePromptContext.Provider value={{ state, showUpgradePrompt, closeUpgradePrompt }}>
      {children}
    </UpgradePromptContext.Provider>
  )
}

export function useUpgradePrompt() {
  const context = useContext(UpgradePromptContext)
  if (!context) {
    throw new Error('useUpgradePrompt must be used within UpgradePromptProvider')
  }
  return context
}
