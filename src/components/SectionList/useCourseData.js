import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryCourses } from "redux/slice/course";

export const useCourseData = ({ type, title, slug, subCategory }) => {
  const dispatch = useDispatch();
  const { categoryCourses } = useSelector((state) => state.courses);
  const courseData = categoryCourses?.[`${title}-${subCategory || ""}`];

  useEffect(() => {
    const shouldFetch =
      title &&
      !courseData?.loading &&
      !courseData?.success &&
      !courseData?.error;

    if (shouldFetch) {
      dispatch(
        getCategoryCourses({
          stateName: `${title}-${subCategory || ""}`,
          category: slug,
          subCategory: subCategory,
        }),
      );
    }
  }, [dispatch, type, title, slug, subCategory, courseData]);

  return courseData;
};
