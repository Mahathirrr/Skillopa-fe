import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

import Layout from "src/components/Layout";
import PaymentSummary from "src/components/PaymentSummary";
import Button from "src/components/Button";
import { fetchCourse } from "redux/slice/course";
import { createPayment } from "redux/slice/payment";
import { getYouTubeThumbnail } from "src/utils";

const Checkout = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const dispatch = useDispatch();

  const {
    data: course,
    fetch: { loading, error },
  } = useSelector((state) => state.courses.course);

  const {
    createPayment: { loading: paymentLoading },
  } = useSelector((state) => state.payment);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourse({ id: courseId }));
    }
  }, [dispatch, courseId]);

  const handlePayment = async () => {
    try {
      const response = await dispatch(createPayment(courseId)).unwrap();
      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-red-600">
            Error loading course
          </h2>
          <Link href="/">
            <a className="mt-4 text-primary hover:underline">Return to Home</a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex gap-4">
                <div className="w-40">
                  <Image
                    src={getYouTubeThumbnail(course.previewMedia)}
                    alt={course.title}
                    width={160}
                    height={90}
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-600 mt-2">{course.subtitle}</p>
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">By </span>
                    {course.instructors.map((instructor, index) => (
                      <span key={instructor._id} className="text-sm">
                        {instructor.name}
                        {index < course.instructors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <PaymentSummary course={course} />
            <Button
              label={
                course.pricing === "Free" ? "Enroll Now" : "Proceed to Payment"
              }
              className="w-full mt-4 py-3"
              loading={paymentLoading}
              onClick={handlePayment}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
