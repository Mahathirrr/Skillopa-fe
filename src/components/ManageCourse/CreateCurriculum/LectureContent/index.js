import React from "react";
import DOMPurify from "dompurify";
import VideoPlayer from "src/components/VideoPlayer";

const LectureContent = ({ lecture }) => {
  const renderContent = () => {
    switch (lecture.class) {
      case "Lecture":
      case "Quiz":
        return (
          <div className="mt-4">
            <VideoPlayer url={lecture.embedUrl} />
          </div>
        );
      case "Text":
        return (
          <div
            className="prose max-w-none p-6 mt-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(lecture.textContent),
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">{lecture.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {lecture.class === "Text" ? "Text Content" : "Video Content"}
        </p>
      </div>
      {renderContent()}
    </div>
  );
};

export default LectureContent;
