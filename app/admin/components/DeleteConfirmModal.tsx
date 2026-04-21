'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  patientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  patientName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-full md:max-w-md my-8">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex-1">Delete Patient</h2>
          </div>

          <p className="text-sm sm:text-base text-gray-700 mb-4">
            Are you sure you want to delete <span className="font-semibold">{patientName}</span>?
          </p>

          <p className="text-sm text-gray-600 bg-red-50 border border-red-200 rounded p-3 mb-6">
            This action cannot be undone. All associated health records, appointments, and caregiver assignments will be permanently deleted.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Patient
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
