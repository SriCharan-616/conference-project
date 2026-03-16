import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useConference, useRegisterForConference, useCreatePayment } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterConference() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const { data: conference } = useConference(id);
  const registerMutation = useRegisterForConference();
  const paymentMutation = useCreatePayment();

  const onSubmit = async (data) => {
    try {
      // Create registration
      const registrationRes = await registerMutation.mutateAsync({
        conference: id,
      });

      toast.success("Registration created!");

      // Handle payment if amount is specified
      if (data.amount) {
        try {
          await paymentMutation.mutateAsync({
            registration: registrationRes.data.id,
            amount: data.amount,
            method: data.payment_method,
            transaction_id: `TXN-${Date.now()}`,
          });

          toast.success("Payment recorded!");
          navigate(`/myregistrations`);
        } catch (error) {
          toast.error("Payment failed, but registration created");
          navigate(`/myregistrations`);
        }
      } else {
        navigate(`/myregistrations`);
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  if (!conference) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container-custom max-w-2xl">
        <h1 className="page-header mb-2">Complete Registration</h1>
        <p className="page-subtitle mb-8">
          for <strong>{conference.title}</strong>
        </p>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Participant Info */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Participant Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={user?.first_name || ""}
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed mt-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    {...register("registration_type")}
                    className="input-field mt-2"
                  >
                    <option value="attendee">Attendee</option>
                    <option value="author">Author</option>
                    <option value="organiser">Organiser</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...register("amount", {
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Invalid amount format",
                      },
                    })}
                    className="input-field"
                  />
                  {errors.amount && <p className="error-text">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    {...register("payment_method")}
                    className="input-field"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register("agree_terms", {
                  required: "You must agree to the terms",
                })}
                className="mt-1"
              />
              <label className="ml-3 text-sm text-gray-700">
                I agree to the conference terms and conditions
              </label>
              {errors.agree_terms && (
                <p className="error-text ml-3">{errors.agree_terms.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/conference/${id}`)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
