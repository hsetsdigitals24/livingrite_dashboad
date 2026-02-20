import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";



interface InvitationCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedBy: string | null;
  usedAt: string | null;
}
const CodesSection = () => {
      const [codes, setCodes] = useState<InvitationCode[]>([]);
      const [generatingCode, setGeneratingCode] = useState(false);
      const [expiryDays, setExpiryDays] = useState(3);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [successMessage, setSuccessMessage] = useState<string | null>(null);

      useEffect(() => {        
        fetchCodes();
      }, []);

        // Fetch invitation codes
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/codes');
      const result = await response.json();
      setCodes(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching codes:', err);
      setError('An error occurred while fetching codes');
    } finally {
      setLoading(false);
    }
  };


  // Generate new invitation code
  const handleGenerateCode = async () => {
    try {
      setGeneratingCode(true);
      const response = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiryDays }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const newCode = await response.json();
      setCodes([newCode, ...codes]);
      setSuccessMessage('Invitation code generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error generating code:', err);
      setError('Failed to generate invitation code');
    } finally {
      setGeneratingCode(false);
    }
  };
  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this code? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete code');
      }

      setCodes(codes.filter((c) => c.id !== codeId));
      setSuccessMessage('Invitation code deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting code:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete code');
    }
  }


    return (
           <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Invitation Codes</h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="expiry" className="text-sm font-medium text-gray-700">
                  Expires in (days):
                </label>
                <input
                  id="expiry"
                  type="number"
                  min="1"
                  max="365"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                  className="w-16 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleGenerateCode}
                disabled={generatingCode}
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generatingCode ? 'Generating...' : '+ Generate Code'}
              </button>
            </div>
          </div>

            {/* Code Statistics */}
          {codes.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold text-green-600">
                  {codes.filter((c) => !c.isUsed && new Date(c.expiresAt) > new Date()).length}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Used Codes</p>
                <p className="text-2xl font-bold text-blue-600">{codes.filter((c) => c.isUsed).length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Expired Codes</p>
                <p className="text-2xl font-bold text-red-600">
                  {codes.filter((c) => !c.isUsed && new Date(c.expiresAt) < new Date()).length}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading codes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Used By
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Used At
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Created
                    </th>
                    <th>
                        <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {codes.length > 0 ? (
                    codes.map((code) => {
                      const isExpired = new Date(code.expiresAt) < new Date();
                      return (
                        <tr
                          key={code.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-mono text-gray-900 font-medium">
                            {code.code}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                code.isUsed
                                  ? 'bg-blue-100 text-blue-800'
                                  : isExpired
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {code.isUsed ? 'Used' : isExpired ? 'Expired' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(code.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {code.usedBy || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(code.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteCode(code.id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                              <Trash2 className='h-4 w-4'/>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No invitation codes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
    );
}

export default CodesSection;