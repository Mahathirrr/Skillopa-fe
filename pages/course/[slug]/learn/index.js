import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import CurriculumAccordion from "src/components/Curriculum/CurriculumAccordion";
import CourseNavbar from "src/components/CourseNavbar";
import VideoPlayer from "src/components/VideoPlayer";
import CenterAligned from "src/components/CenterAligned";
import { CircularProgress } from "@mui/material";
import { fetchCourse } from "redux/slice/course";

const CourseLearningPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentContent, setCurrentContent] = useState(null);

  const { isAuthenticated, profile } = useSelector((state) => state.auth);
  const {
    fetch: { loading, error, success },
    data: course,
  } = useSelector((state) => state.courses.course);

  const { slug } = router.query;

  useEffect(() => {
    if (!slug) router.push("/");
  }, []);

  useEffect(() => {
    if (isAuthenticated && slug && course?.slug !== slug) {
      dispatch(fetchCourse({ slug }));
    } else if (!isAuthenticated && slug) {
      router.push(`/course/${slug}`);
    }
  }, [dispatch, isAuthenticated, slug, course?.slug]);

  useEffect(() => {
    if (
      course?._id &&
      !profile?.enrolledCourses.some((c) => c.course === course._id) &&
      slug
    ) {
      router.push(`/course/${slug}`);
    }
  }, [dispatch, profile?.enrolledCourses, course?._id]);

  useEffect(() => {
    if (success && !currentContent && course?.curriculum?.[0]?.content?.[0]) {
      setCurrentContent(course.curriculum[0].content[0]);
    }
  }, [course?.curriculum, success, currentContent]);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleItemClick = (content) => {
    setCurrentContent(content);
  };

  const renderMainContent = () => {
    if (!currentContent) return null;

    switch (currentContent.class) {
      case "Lecture":
        return (
          <div className="w-full aspect-video">
            <VideoPlayer url={currentContent.embedUrl} />
          </div>
        );
      case "Quiz":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              {currentContent.title}
            </h2>
            <div
              className="prose max-w-none quiz-content"
              dangerouslySetInnerHTML={{
                __html: currentContent.textContent || currentContent.embedUrl,
              }}
            />
          </div>
        );
      case "Text":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              {currentContent.title}
            </h2>
            <div
              className="prose max-w-none text-content"
              dangerouslySetInnerHTML={{
                __html: currentContent.textContent,
              }}
            />
          </div>
        );
      default:
        return (
          <CenterAligned height="screen">
            <p>Content type not supported</p>
          </CenterAligned>
        );
    }
  };

  const renderPage = () => {
    return (
      <div className="flex text-base h-auto overflow-auto overscroll-auto">
        <div
          className={classnames({
            "w-full lg:w-3/5": showSidebar,
            "w-full": !showSidebar,
          })}
        >
          <div className="relative bg-white min-h-screen">
            {renderMainContent()}
            {!showSidebar && (
              <IconButton
                size="large"
                color="inherit"
                aria-label="back"
                onClick={toggleSidebar}
                className="absolute top-2 right-2 z-50 bg-bodyBg hover:bg-bodyBg drop-shadow-md"
              >
                <KeyboardBackspaceIcon />
              </IconButton>
            )}
          </div>
          <div
            className={classnames("mx-5 md:mx-16 lg:mx-40 mt-5 md:mt-10", {
              "lg:hidden": showSidebar,
            })}
          >
            <CurriculumAccordion
              viewOnly
              handleItemClick={handleItemClick}
              activeChapterItem={currentContent}
            />
          </div>
        </div>
        {showSidebar && (
          <div className="hidden lg:block lg:w-2/5 xl:w-1/3 2xl:w-1/4 lg:sticky lg:top-0 bg-white border-l border-gray-200">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <p className="font-semibold text-lg">Course Content</p>
              <IconButton aria-label="close" onClick={toggleSidebar}>
                <CloseIcon />
              </IconButton>
            </div>
            <div
              className="overflow-auto overscroll-auto"
              style={{ height: "calc(100vh - 64px)" }}
            >
              <CurriculumAccordion
                viewOnly
                handleItemClick={handleItemClick}
                activeChapterItem={currentContent}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <CenterAligned height="screen">
          <CircularProgress />
        </CenterAligned>
      );
    }

    if (error) {
      return (
        <CenterAligned height="screen">
          <h3>Error fetching course</h3>
        </CenterAligned>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <CourseNavbar title={course?.title} slug={course?.slug} />
        {renderPage()}
      </div>
    );
  };

  return renderContent();
};

export default CourseLearningPage;
