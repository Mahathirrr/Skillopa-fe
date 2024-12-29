import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CourseCarousel from "../CourseCarousel";

import { getCategoryCourses } from "redux/slice/course";

const SectionList = (props) => {
  const {
    interest: { type, title, slug },
  } = props;

  const dispatch = useDispatch();
  const { categoryCourses } = useSelector((state) => state.courses);

  useEffect(() => {
    if (
      title &&
      !categoryCourses?.[title]?.loading &&
      !categoryCourses?.[title]?.courses.length
    ) {
      dispatch(
        getCategoryCourses({
          stateName: title,
          [type]: slug,
        }),
      );
    }
  }, [dispatch, title, type, slug, categoryCourses]);

  // Jangan render apapun jika tidak ada course
  if (
    !categoryCourses?.[title]?.courses?.length &&
    !categoryCourses?.[title]?.loading
  ) {
    return null;
  }

  return (
    <CourseCarousel
      title={title}
      data={categoryCourses?.[title]?.courses}
      loading={categoryCourses?.[title]?.loading}
    />
  );
};

export default SectionList;
