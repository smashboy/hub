import * as z from "zod"
import useCustomMutation from "app/core/hooks/useCustomMutation"
import markNotificationAsRead from "../mutations/markNotificationAsRead"
import { notificationsPrismaModelKey } from "../validations"
import updateNotificationSaved from "../mutations/updateNotificationSaved"

export type NotificationsPrismaModelKey = z.infer<typeof notificationsPrismaModelKey>

const useNotificationsManager = () => {
  const [markNotificationAsReadMutation, { isLoading: isLoadingMarkAsRead }] = useCustomMutation(
    markNotificationAsRead,
    {}
  )

  const [updateNotificationSavedMutation, { isLoading: isLoadingUpdateSaved }] = useCustomMutation(
    updateNotificationSaved,
    {}
  )

  const handleMarkAsRead = async (id: number, key: NotificationsPrismaModelKey) => {
    await markNotificationAsReadMutation({
      notificationId: id,
      notificationsPrismaModelKey: key,
    })
  }

  const handleUpdateSavedStatus = async (
    id: number,
    key: NotificationsPrismaModelKey,
    newFlag: boolean
  ) => {
    await updateNotificationSavedMutation({
      notificationId: id,
      notificationsPrismaModelKey: key,
      isSaved: newFlag,
    })
  }

  return {
    isLoadingMarkAsRead,
    isLoadingUpdateSaved,
    markAsRead: handleMarkAsRead,
    updateSavedStatus: handleUpdateSavedStatus,
  }
}

export default useNotificationsManager
