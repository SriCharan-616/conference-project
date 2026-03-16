import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRegistration, useCreatePayment } from "../../hooks/useAPI";

const PAYMENT_METHODS = [
  { value: "card", label: "Credit/Debit Card" },
  { value: "upi", label: "UPI" },
  { value: "netbanking", label: "Net Banking" },
  { value: "cash", label: "Cash Payment" },
];

export default function PaymentForm() {
  const { registrationId } = useParams();
  const navigate = useNavigate();

  const { data: registration, isLoading } = useRegistration(registrationId);
  const createPaymentMutation = useCreatePayment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      method: "card",
      amount: registration?.amount_paid || "",
      transaction_id: "",
    },
  });

  const selectedMethod = watch("method");

  const onSubmit = async (data) => {
    try {
      await createPaymentMutation.mutateAsync({
        registration: registrationId,
        ...data,
      });

      toast.success("Payment processed successfully!");
      navigate("/attendee/registrations");
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container-custom max-w-2xl">
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">Registration not found</p>
            <button
              onClick={() => navigate("/attendee/registrations")}
              className="btn-primary"
            >
              Back to Registrations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/attendee/registrations")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Registrations
        </button>

        <h1 className="page-header mb-2">Complete Payment</h1>
        <p className="page-subtitle mb-8">
          Finalize your registration for {registration.conference.title}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600">Conference</p>
                  <p className="font-medium text-gray-900">
                    {registration.conference.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(
                      registration.registration_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{registration.amount_paid || "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{registration.amount_paid || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="card p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Payment Method *
                  </label>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.value}
                        className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                      >
                        <input
                          type="radio"
                          value={method.value}
                          {...register("method")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-900">
                            {method.label}
                          </span>
                          {method.value !== "card" && (
                            <span className="text-sm text-gray-500">
                              Pay offline
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card Payment Fields */}
                {selectedMethod === "card" && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Credit/Debit Card payment integration would go here
                    </p>
                    <input
                      type="text"
                      placeholder="Card Number"
                      disabled
                      className="input-field opacity-50"
                    />
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    placeholder="Amount"
                    disabled
                    value={registration.amount_paid || ""}
                    className="input-field bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Amount is fixed for this conference registration
                  </p>
                </div>

                {/* Transaction ID (for some methods) */}
                {selectedMethod !== "card" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID / Reference
                    </label>
                    <input
                      type="text"
                      placeholder="Enter transaction ID or reference number"
                      className="input-field"
                      {...register("transaction_id")}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide your transaction reference for tracking
                    </p>
                  </div>
                )}

                {/* Terms */}
                <div className="border-t pt-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        terms and conditions
                      </a>{" "}
                      and confirm this payment information is correct
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => navigate("/attendee/registrations")}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || createPaymentMutation.isPending
                    }
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isSubmitting || createPaymentMutation.isPending
                      ? "Processing..."
                      : `Pay ₹${registration.amount_paid || "0"}`}
                  </button>
                </div>

                {/* Security Note */}
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-xs text-green-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Your payment is secure and encrypted
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
