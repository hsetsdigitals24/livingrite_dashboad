import { useEffect, useState } from "react";
import PopupForm from "../../components/PopupForm";

interface Popup {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  actionButtonText: string;
  actionButtonUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
const PopupSettingsPage = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [popupModalMode, setPopupModalMode] = useState<
    "create" | "edit" | null
  >(null);
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPopups();
  }, []);

  // Popup handlers
  const handleCreatePopup = () => {
    setSelectedPopup(null);
    setPopupModalMode("create");
  };

  // Fetch popups
  const fetchPopups = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/popups");
      const result = await response.json();
      // Wrap single popup in array
      setPopups(result ? [result[0]] : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching popups:", err);
      setError("An error occurred while fetching popups");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPopup = (popupId: string) => {
    const popup = popups.find((p) => p.id === popupId);
    if (popup) {
      setSelectedPopup(popup);
      setPopupModalMode("edit");
    }
  };

  const handleDeletePopup = async (popupId: string) => {
    if (!confirm("Are you sure you want to delete this popup?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/popups/${popupId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete popup");
      }

      setPopups(popups.filter((p) => p.id !== popupId));
      setSuccessMessage("Popup deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting popup:", err);
      setError("Failed to delete popup");
    }
  };

  const handleTogglePopup = async (popup: Popup) => {
    try {
      const response = await fetch(`/api/admin/popups/${popup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !popup.isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update popup");
      }

      setPopups(
        popups.map((p) =>
          p.id === popup.id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch (err) {
      console.error("Error updating popup:", err);
      setError("Failed to update popup");
    }
  };

  const handlePopupFormClose = () => {
    setPopupModalMode(null);
    setSelectedPopup(null);
  };

  const handlePopupFormSuccess = (updatedPopup: Popup) => {
    if (popupModalMode === "create") {
      setPopups([updatedPopup, ...popups]);
      setSuccessMessage("Popup created successfully!");
    } else if (popupModalMode === "edit") {
      setPopups(
        popups.map((p) => (p.id === updatedPopup.id ? updatedPopup : p)),
      );
      setSuccessMessage("Popup updated successfully!");
    }
    setTimeout(() => setSuccessMessage(null), 3000);
    handlePopupFormClose();
  };


//   console.log("Current popups state:", popups[0]);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Landing Page Popups</h2>
          <button
            onClick={handleCreatePopup}
            className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Popup
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading popups...</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Button Text
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700    ">
                    No. of Displays
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {popups && popups.length > 0 ? (
                  popups
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((popup, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {popup.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {popup.actionButtonText}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleTogglePopup(popup)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              popup.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {popup.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {popup.displayOrder}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {popup.popupCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(popup.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditPopup(popup.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePopup(popup.id)}
                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No popups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(popupModalMode === "create" || popupModalMode === "edit") && (
        <PopupForm
          popup={selectedPopup}
          onClose={handlePopupFormClose}
          onSuccess={handlePopupFormSuccess}
        />
      )}
    </div>
  );
};

export default PopupSettingsPage;
