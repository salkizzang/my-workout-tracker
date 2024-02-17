import { atom } from 'recoil'

export interface Toast {
  id: number
  type: 'success' | 'danger' | 'warning'
  message: string
  onClose?: () => void
}

export const toastState = atom<Toast[]>({
  key: 'toastState',
  default: [],
})
