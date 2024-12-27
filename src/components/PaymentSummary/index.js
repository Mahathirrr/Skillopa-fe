import React from "react";

const PaymentSummary = ({ course }) => {
  // const { profile } = useSelector((state) => state.auth);

  const calculatePlatformFee = (price) => {
    return Math.round(price * 0.1); // 10% platform fee
  };

  const calculateTotal = (price) => {
    return price + calculatePlatformFee(price);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Course Price</span>
          <span className="font-semibold">
            {course.pricing === "Free"
              ? "Free"
              : `IDR ${course.price.toLocaleString()}`}
          </span>
        </div>

        {course.pricing !== "Free" && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Platform Fee (10%)</span>
              <span className="font-semibold">
                IDR {calculatePlatformFee(course.price).toLocaleString()}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">
                  IDR {calculateTotal(course.price).toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>
            By completing your purchase you agree to these Terms of Service.
          </p>
          {course.pricing !== "Free" && (
            <>
              <p className="mt-2">
                Payments are secured and processed by Midtrans Payment Gateway
              </p>
              <p className="mt-2">
                After successful payment, You&apos;ll get immediate access to
                the course
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
