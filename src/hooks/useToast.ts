import { useRecoilState } from 'recoil'
import { Toast, toastState } from '../recoil/toastState'

export function useToast() {
  const [toasts, setToasts] = useRecoilState(toastState)

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now()
    setToasts((oldToasts) => [
      ...oldToasts,
      {
        ...toast,
        id,
        onClose: () => removeToast(id),
      },
    ])

    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id: number) => {
    setToasts((oldToasts) => oldToasts.filter((toast) => toast.id !== id))
  }

  return { addToast, removeToast }
}
