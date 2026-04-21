import React from 'react';

interface ResponsiveTableProps {
  columns: {
    label: string;
    key: string;
    className?: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  rowActions?: (row: any) => React.ReactNode;
  rowClassName?: string;
}

export function ResponsiveTable({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  rowActions,
  rowClassName = '',
}: ResponsiveTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500 text-center">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-sm font-semibold text-gray-700 ${
                      column.className || ''
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
                {rowActions && (
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${rowClassName}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-900 ${
                        column.className || ''
                      }`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key] || '-'}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4 text-right">
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow ${rowClassName}`}
          >
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start gap-2">
                  <span className="text-sm font-medium text-gray-600 flex-shrink-0">
                    {column.label}
                  </span>
                  <span className="text-sm text-gray-900 text-right flex-1">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] || '-'}
                  </span>
                </div>
              ))}
              {rowActions && (
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  {rowActions(row)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
