import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";

import Layout from "src/components/Layout";
import { getCategoryCourses } from "redux/slice/course";
import CourseInfoCard from "src/components/CourseInfoCard";
import CenterAligned from "src/components/CenterAligned";
import NoCourses from "public/assets/void.svg";

export default function Category() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { category } = router.query;
  const [stateName, setStateName] = useState();
  const { categoryCourses } = useSelector((state) => state.courses);

  useEffect(() => {
    const state = category?.[1] || category?.[0];
    setStateName(state);

    if (
      state &&
      !categoryCourses?.[state]?.loading &&
      !categoryCourses?.[state]?.courses
    ) {
      dispatch(
        getCategoryCourses({
          stateName: state,
          category: category?.[0],
          subCategory: category?.[1],
        }),
      );
    }
  }, [dispatch, category, categoryCourses]);

  const renderContent = () => {
    if (categoryCourses?.[stateName]) {
      if (!categoryCourses[stateName]?.courses?.length) {
        return (
          <CenterAligned>
            <Image src={NoCourses} width="250" height="250" alt="No courses" />
            <p className="mt-10 font-medium text-lg">No courses found</p>
          </CenterAligned>
        );
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categoryCourses[stateName].courses.map((course, i) => (
            <CourseInfoCard key={i} course={course} />
          ))}
        </div>
      );
    }
  };

  return (
    <Layout
      loading={categoryCourses?.[stateName]?.loading}
      error={categoryCourses?.[stateName]?.error}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <h1 className="font-comedik text-3xl font-bold mb-8 text-primaryLight">
          {categoryCourses?.[stateName]?.title}
        </h1>
        {renderContent()}
      </div>
    </Layout>
  );
}
