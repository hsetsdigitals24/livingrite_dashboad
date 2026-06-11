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
  popupCount: number;
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
      // Display all popups, or empty array if none exist
      setPopups(Array.isArray(result) ? result : []);
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
    <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Landing Page Popups</h2>
        <button
          onClick={handleCreatePopup}
          className="w-full sm:w-auto bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Popup
        </button>
      </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading popups...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block border border-gray-200 rounded-lg overflow-x-auto">
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
                          {popup && popup.title && popup.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {popup && popup.actionButtonText && popup.actionButtonText}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleTogglePopup(popup)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              popup && popup.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {popup && popup.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {popup && popup.displayOrder && popup.displayOrder}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {popup && popup.popupCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {popup && new Date(popup.createdAt).toLocaleDateString()}
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
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No popups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
              {popups && popups.length > 0 ? (
                popups.map((popup) => (
                  <div key={popup.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-2">{popup.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{popup.actionButtonText}</p>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                        popup.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {popup.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Order</p>
                        <p className="font-semibold">{popup.displayOrder}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Displays</p>
                        <p className="font-semibold">{popup.popupCount}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <button onClick={() => handleEditPopup(popup.id)} className="flex-1 px-3 py-1.5 text-xs border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
                        Edit
                      </button>
                      <button onClick={() => handleTogglePopup(popup)} className="flex-1 px-3 py-1.5 text-xs border border-orange-300 text-orange-600 rounded hover:bg-orange-50">
                        {popup.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => handleDeletePopup(popup.id)} className="flex-1 px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No popups found</p>
              )}
            </div>
          </>
        )}

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
