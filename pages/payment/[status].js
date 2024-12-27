import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "src/components/Layout";
import Button from "src/components/Button";
import { getPaymentStatus } from "redux/slice/payment";

import PaymentSuccess from "public/assets/payment_success.svg";
import PaymentPending from "public/assets/payment_pending.svg";
import PaymentError from "public/assets/payment_error.svg";

const PaymentStatus = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderId, status } = router.query;

  const { paymentStatus } = useSelector((state) => state.payment);

  useEffect(() => {
    if (orderId) {
      dispatch(getPaymentStatus(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusImage = () => {
    switch (status) {
      case "finish":
        return PaymentSuccess;
      case "pending":
        return PaymentPending;
      case "error":
        return PaymentError;
      default:
        return PaymentError;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "finish":
        return "Payment successful! You can now access your course.";
      case "pending":
        return "Payment is pending. We will notify you once the payment is confirmed.";
      case "error":
        return "Payment failed. Please try again or contact support.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  if (paymentStatus.loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <CircularProgress />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <Image
            src={getStatusImage()}
            alt="Payment Status"
            width={200}
            height={200}
          />

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === "finish" ? "Thank You!" : "Payment Status"}
          </h2>

          <p className="mt-2 text-sm text-gray-600">{getStatusMessage()}</p>

          {status === "finish" && (
            <div className="mt-4">
              <Link href="/my-courses">
                <Button label="Go to My Courses" />
              </Link>
            </div>
          )}

          {(status === "pending" || status === "error") && (
            <div className="mt-4">
              <Link href="/">
                <Button label="Back to Home" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentStatus;
