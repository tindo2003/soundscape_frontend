import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial unread count
  useEffect(() => {
    fetch(`${DJANGO_USER_ENDPOINT}/notifications/`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const unread = data.notifications.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      });
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8001/ws/notifications/");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      // When a new notification arrives, increment the count
      setUnreadCount((prev) => prev + 1);
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="relative">
      <button aria-label="Notifications">
        <Bell className="w-6 h-6" />
      </button>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
          {unreadCount}
        </span>
      )}
    </div>
  );
} 