import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { storage } from "../utils/data";
import { Empty } from "../components/UI";
import { Bell } from "lucide-react";

const TYPE_ICON = {
  appointment: "📅",
  payment: "💳",
  system: "🔔",
  reminder: "⏰",
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (!user) return;
    const all = storage
      .getNotifications()
      .filter((n) => n.userId === user.id)
      .reverse();
    setNotifs(all);
    // Mark all as read
    const updated = storage
      .getNotifications()
      .map((n) => (n.userId === user.id ? { ...n, read: true } : n));
    storage.setNotifications(updated);
  }, [user]);

  if (!user)
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center text-[var(--muted)]">
        Please log in to view notifications.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-head font-extrabold text-3xl mb-8">Notifications</h1>

      {notifs.length === 0 ? (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)]">
          <Empty
            icon="🔔"
            title="No notifications yet"
            desc="You'll see appointment updates and confirmations here."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.09)] overflow-hidden divide-y divide-[rgba(0,0,0,0.06)]">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`px-6 py-5 transition-colors ${!n.read ? "bg-green-50/60" : "hover:bg-cream"}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-xl mt-0.5 flex-shrink-0">
                  {TYPE_ICON[n.type] || "🔔"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm font-body">{n.title}</p>
                    {!n.read && (
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-xs text-[var(--faint)] mt-2">
                    {new Date(n.time).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
