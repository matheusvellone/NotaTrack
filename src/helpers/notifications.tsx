import {
  NotificationData,
  notifications,
} from '@mantine/notifications'
import { IconAlertTriangle, IconCircleCheck, IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react'
import { randomId } from '~/helpers/string'
import '@mantine/notifications/styles.css'

export enum NotificationType {
  SUCCESS,
  ERROR,
  INFO,
  WARN,
  LOADING,
}

const defaultOptions: Record<NotificationType, Partial<NotificationData>> = {
  [NotificationType.SUCCESS]: {
    color: 'green',
    icon: <IconCircleCheck />,
    loading: false,
    autoClose: true,
    withCloseButton: true,
  },
  [NotificationType.ERROR]: {
    color: 'red',
    icon: <IconExclamationCircle />,
    loading: false,
    autoClose: 10_000,
    withCloseButton: true,
  },
  [NotificationType.INFO]: {
    color: 'blue',
    icon: <IconInfoCircle />,
    loading: false,
    autoClose: true,
    withCloseButton: true,
  },
  [NotificationType.WARN]: {
    color: 'yellow',
    icon: <IconAlertTriangle />,
    loading: false,
    autoClose: true,
    withCloseButton: true,
  },
  [NotificationType.LOADING]: {
    color: 'blue',
    loading: true,
    autoClose: false,
    withCloseButton: false,
  },
}

export const showNotification = (type: NotificationType, options: NotificationData) => {
  const id = options.id ?? randomId()
  const allOptions = {
    ...defaultOptions[type],
    ...options,
    id,
  }

  notifications.show(allOptions)

  return id
}

// export const updateNotification = (id: string, type: NotificationType, options: NotificationProps) => {
//   const allOptions = Object.assign({ id }, defaultOptions[type], options)

//   mantineUpdateNotification(allOptions)
// }

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return JSON.stringify(error)
}

export const notificateError = (title: string, error: unknown) => showNotification(NotificationType.ERROR, {
  title,
  message: getErrorMessage(error),
})

// export const getNotificationErrorHandler = (title: string) => (error: unknown) => notificateError(title, error)
