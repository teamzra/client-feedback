import { useState } from "react";
import FeedbackForm from "./FeedbackForm";

const formatText = (text) => {
  if (!text) return "";
  return text
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [activeId, setActiveId] = useState(null);

  // 🔵 Client feedback = new version + notification
  const addFeedback = (text) => {
    const latestVersion =
      feedbacks.length > 0 ? feedbacks[0].version : 0;

    setFeedbacks((prev) => [
      {
        id: Date.now(),
        version: latestVersion + 1,
        text: formatText(text),
        status: "Pending",
        adminMessages: [],
        isActive: true,
        notification: "client", // 🔔
      },
      ...prev.map((fb) => ({
        ...fb,
        isActive: false,
        notification: null,
      })),
    ]);
  };

  // ✅ Approve = clear notification
  const approve = (id) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id && fb.isActive && fb.status === "Pending"
          ? {
              ...fb,
              status: "Approved",
              isActive: false,
              notification: null,
            }
          : fb
      )
    );
    setActiveId(null);
    setNoteInput("");
  };

  // 🟡 Admin starts responding → clear client badge
  const markChanges = (id) => {
    setActiveId(id);
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id ? { ...fb, notification: null } : fb
      )
    );
  };

  // 🟡 Admin message → notify client
  const saveMessage = (e) => {
    e.preventDefault();

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === activeId && fb.isActive
          ? {
              ...fb,
              status: "Changes Required",
              adminMessages: [
                ...fb.adminMessages,
                formatText(noteInput),
              ],
              notification: "admin", // 🔔
            }
          : fb
      )
    );
    setNoteInput("");
    setActiveId(null);
  };

  const statusStyles = {
    Pending: "bg-gray-100 text-gray-700",
    "Changes Required": "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-700",
  };

  const notificationBadge = (type) => {
    if (type === "client") {
      return (
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
          New Client Update
        </span>
      );
    }
    if (type === "admin") {
      return (
        <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
          Admin Responded
        </span>
      );
    }
    return null;
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gray-100 p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-4">
          Client Feedback Dashboard
        </h1>
        <FeedbackForm onAdd={addFeedback} />
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className={`bg-white p-6 rounded-xl shadow ${
              !fb.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Top Row: Version + Notification */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full">
                Version v{fb.version}
              </span>

              {notificationBadge(fb.notification)}
            </div>

            {/* Client Message */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm font-semibold text-blue-700">
                Client Message
              </p>
              <p className="text-gray-800 mt-1">
                {fb.text}
              </p>
            </div>

            {/* Admin Messages */}
            {fb.adminMessages.length > 0 && (
              <div className="mt-4 space-y-2">
                {fb.adminMessages.map((msg, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
                  >
                    <p className="text-sm font-semibold text-yellow-800">
                      Admin Message {index + 1}
                    </p>
                    <p className="text-yellow-700 mt-1">
                      {msg}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center mt-5">
              <span
                className={`text-sm px-3 py-1 rounded-full ${statusStyles[fb.status]}`}
              >
                {fb.status}
              </span>

              <div className="flex gap-2">
                {fb.isActive && fb.status === "Pending" && (
                  <button
                    onClick={() => approve(fb.id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded"
                  >
                    Approve
                  </button>
                )}

                {fb.isActive && fb.status !== "Approved" && (
                  <button
                    onClick={() => markChanges(fb.id)}
                    className="bg-yellow-500 text-white px-4 py-1.5 rounded"
                  >
                    Changes
                  </button>
                )}
              </div>
            </div>

            {/* Admin Input */}
            {fb.isActive && activeId === fb.id && (
              <form onSubmit={saveMessage} className="mt-4">
                <input
                  value={noteInput}
                  onChange={(e) =>
                    setNoteInput(e.target.value)
                  }
                  placeholder="Write message for client (Enter or Send)"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-yellow-400"
                />

                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Press Enter to submit
                  </p>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-1.5 rounded"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
