import { TFilterResponse } from "@/models/filter-response.model";
import { API, apiPath } from "../api";
import { TNotification } from "@/models/notification.model";

const path = apiPath('/notifications');

export const NotificationService = Object.freeze({
  getOwnNotifications: async (pagination: {pageIndex?: number, pageSize?: number}) => {
    const res = await API.get<TFilterResponse<TNotification>>(path('/'), pagination);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  markAsRead: async (notificationId: number) => {
    const res = await API.post<TNotification>(path('/read/'+notificationId));
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  markAllAsRead: async () => {
    const res = await API.post<{count: number}>(path('/read-all/'));
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
})