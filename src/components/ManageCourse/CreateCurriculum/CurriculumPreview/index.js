import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import VideoPlayer from "src/components/VideoPlayer";
import CurriculumAccordion from "src/components/Curriculum/CurriculumAccordion";

const CurriculumPreview = () => {
  const [activeContent, setActiveContent] = useState(null);
  const { data } = useSelector((state) => state.courses.course);

  useEffect(() => {
    if (data?.curriculum?.[0]?.content?.[0]) {
      setActiveContent(data.curriculum[0].content[0]);
    }
  }, [data]);

  const handleContentChange = (content) => {
    setActiveContent(content);
  };

  const renderContent = () => {
    if (!activeContent) return null;

    switch (activeContent.class) {
      case "Lecture":
      case "Quiz":
        return <VideoPlayer url={activeContent.embedUrl} />;
      case "Text":
        return (
          <div
            className="prose max-w-none p-6"
            dangerouslySetInnerHTML={{ __html: activeContent.textContent }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">{renderContent()}</div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <CurriculumAccordion
          viewOnly
          handleItemClick={handleContentChange}
          activeChapterItem={activeContent}
          previewMode={true}
        />
      </div>
    </div>
  );
};

export default CurriculumPreview;
