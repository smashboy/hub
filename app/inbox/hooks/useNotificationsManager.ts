import useCustomMutation from "app/core/hooks/useCustomMutation"
import markNotificationAsRead from "../mutations/markNotificationAsRead"
import updateNotificationSaved from "../mutations/updateNotificationSaved"

const useNotificationsManager = () => {
  const [markNotificationAsReadMutation, { isLoading: isLoadingMarkAsRead }] = useCustomMutation(
    markNotificationAsRead,
    {}
  )

  const [updateNotificationSavedMutation, { isLoading: isLoadingUpdateSaved }] = useCustomMutation(
    updateNotificationSaved,
    {}
  )

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsReadMutation({
      notificationId: id,
    })
  }

  const handleUpdateSavedStatus = async (id: number, newFlag: boolean) => {
    await updateNotificationSavedMutation({
      notificationId: id,
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
