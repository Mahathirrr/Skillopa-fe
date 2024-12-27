import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import CenterAligned from "src/components/CenterAligned";
import Button from "src/components/Button";
import CurriculumList from "./CurriculumList";
import ChapterForm from "./ChapterForm";
import LectureForm from "./LectureForm";
import LectureContent from "./LectureContent";
import CurriculumPreview from "./CurriculumPreview";

import {
  setIsEditMode,
  setRenderChapterForm,
  updateCourse,
} from "redux/slice/course";

const CreateCurriculum = () => {
  const dispatch = useDispatch();
  const [previewMode, setPreviewMode] = useState(false);

  const {
    renderChapterForm,
    renderLectureForm,
    data,
    currLectureData,
    update: { loading },
  } = useSelector((state) => state.courses.course);

  const onSubmit = () => {
    dispatch(updateCourse({ curriculum: data.curriculum, _id: data._id }));
  };

  const showChapterForm = () => {
    dispatch(setIsEditMode(false));
    dispatch(setRenderChapterForm());
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const renderForm = () => {
    if (!renderChapterForm && !renderLectureForm) {
      return (
        <CenterAligned className="py-20 gap-5">
          <AddCircleOutlineOutlinedIcon fontSize="large" />
          <p className="font-medium">
            {!data?.curriculum.length
              ? "Start by creating the First Chapter"
              : "Expand the Curriculum"}
          </p>
          <Button label="Add new Chapter" onClick={showChapterForm} />
        </CenterAligned>
      );
    }

    if (renderChapterForm) {
      return <ChapterForm />;
    }

    if (renderLectureForm) {
      return <LectureForm />;
    }
  };

  const renderContent = () => {
    if (previewMode) {
      return <CurriculumPreview />;
    }

    return (
      <div className="flex flex-col gap-5">
        {currLectureData && <LectureContent lecture={currLectureData} />}
        {renderForm()}
      </div>
    );
  };

  return (
    <div>
      <div className="p-6 pt-0 border-b border-labelText mb-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Curriculum</h1>
        <div className="flex gap-4">
          <Button
            label={previewMode ? "Edit Mode" : "Preview Mode"}
            variant="outlined"
            onClick={togglePreviewMode}
          />
          <Button
            label="Save"
            type="submit"
            onClick={onSubmit}
            loading={loading}
          />
        </div>
      </div>
      <Alert severity="info" variant="outlined">
        Here&apos;s where you add course content—like lectures, course sections,
        assignments, and more. Click the button below to get started.
      </Alert>
      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        <div className="w-full lg:w-7/12 bg-formBg p-3">{renderContent()}</div>
        <div className="w-full lg:w-5/12 bg-formBg flex flex-col gap-5 p-3">
          <div className="overflow-auto" style={{ maxHeight: "485px" }}>
            <CurriculumList previewMode={previewMode} />
          </div>
          {!previewMode && (
            <div className="bg-tertiaryBg p-2">
              <Button
                label="Add new Chapter"
                variant="transparent"
                className="text-lg w-full"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={showChapterForm}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCurriculum;
