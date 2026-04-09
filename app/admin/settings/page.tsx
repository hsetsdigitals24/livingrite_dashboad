"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const settingsSchema = z.object({
  paymentAccountName: z.string().optional(),
  paymentAccountNumber: z.string().optional(),
  paymentBankName: z.string().optional(),
  paymentBankCode: z.string().optional(),
  paymentCurrency: z.string().default("NGN"),
  paymentInstructions: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (!response.ok) throw new Error("Failed to fetch settings");
        const { data } = await response.json();
        reset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      const result = await response.json();
      reset(result.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your payment account details that will be sent to clients
          with their invoices.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Settings updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Name / Business Name
                </label>
                <Input
                  {...register("paymentAccountName")}
                  placeholder="e.g., LivingRite Care Limited"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Number
                </label>
                <Input
                  {...register("paymentAccountNumber")}
                  placeholder="e.g., 0123456789"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Name
                </label>
                <Input
                  {...register("paymentBankName")}
                  placeholder="e.g., GTBank, Access Bank, First Bank"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Code (Optional)
                </label>
                <Input
                  {...register("paymentBankCode")}
                  placeholder="e.g., 044 for GTBank"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Currency
                </label>
                <select
                  {...register("paymentCurrency")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Instructions */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Additional Instructions</h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Instructions (Optional)
              </label>
              <textarea
                {...register("paymentInstructions")}
                placeholder="e.g., 'Please include the invoice number in the payment reference. Payment should be received within 7 days.'"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                These instructions will be included in all invoices sent to
                clients.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Section */}
      <Card className="mt-8 p-6 bg-gray-50">
        <h3 className="font-semibold text-lg mb-4">Invoice Preview</h3>
        <p className="text-sm text-gray-600 mb-4">
          This is how the payment instructions will appear in invoices:
        </p>
        <div className="bg-white p-4 border rounded-lg text-sm">
          <table className="w-full text-left">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium w-32">Account Name:</td>
                <td className="py-2">
                  <span className="text-gray-600">LivingRite Care Limited</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Account Number:</td>
                <td className="py-2">
                  <span className="text-gray-600">0123456789</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Bank Name:</td>
                <td className="py-2">
                  <span className="text-gray-600">GTBank</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Currency:</td>
                <td className="py-2">
                  <span className="text-gray-600">NGN</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
