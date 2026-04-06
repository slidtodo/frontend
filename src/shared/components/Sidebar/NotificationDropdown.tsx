'use client';

import { useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BellIcon } from 'lucide-react';
import { notificationQueries } from '@/shared/lib/queryKeys';
import { fetchNotifications } from '@/shared/lib/api/fetchNotifications';

function getRelativeTime(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const weeks = Math.floor(days / 7);
  return `${weeks}주 전`;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isSidebarOpen: boolean;
}

export default function NotificationDropdown({ isOpen, onOpen, onClose, isSidebarOpen }: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery(notificationQueries.list());

  const { mutate: markAsRead } = useMutation({
    mutationFn: fetchNotifications.patchNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const hasUnread = unreadNotifications.length > 0;

  const handleMarkAllRead = () => {
    unreadNotifications.forEach((n) => markAsRead(n.id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className={`group hover:text-bearlog-600 relative text-gray-500 transition-all duration-200 ${
          isSidebarOpen ? 'rounded-[999px] border border-gray-200 p-[20px]' : 'p-0'
        }`}
      >
        <BellIcon size={24} className="transition-transform group-hover:scale-110" />
        {hasUnread && (
          <div
            className={`bg-bearlog-500 absolute top-[2px] right-[5px] rounded-full ${isSidebarOpen ? 'h-3 w-3' : 'h-2 w-2'}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-0 left-full z-50 ml-2 w-[320px] rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-base font-semibold text-gray-800">알림</span>
            {hasUnread && (
              <button onClick={handleMarkAllRead} className="text-bearlog-600 text-sm font-medium hover:underline">
                모두 읽기
              </button>
            )}
          </div>

          <ul className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-gray-400">알림이 없습니다.</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                  className={`flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-gray-50/50' : ''
                  }`}
                >
                  <div className="mt-2 shrink-0">
                    {!notification.isRead && <div className="bg-bearlog-500 h-2 w-2 rounded-full" />}
                    {notification.isRead && <div className="h-2 w-2" />}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm leading-snug text-gray-800">{notification.message}</p>
                    <span className="text-xs text-gray-400">{getRelativeTime(notification.createdAt)}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
