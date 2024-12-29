import React from "react";
import CourseCarousel from "../CourseCarousel";
import { useCourseData } from "./useCourseData";

const SectionList = ({ interest }) => {
  const courseData = useCourseData(interest);

  // Skip rendering if no data or loading initial data
  if (!courseData || (courseData.loading && !courseData.courses)) {
    return null;
  }

  // Only render if we have courses
  if (courseData.courses?.length > 0) {
    return (
      <CourseCarousel
        title={`${interest.title} ${interest.subCategory ? "- " + interest.subCategory : ""}`}
        data={courseData.courses}
        loading={courseData.loading}
      />
    );
  }

  return null;
};

export default React.memo(SectionList);
