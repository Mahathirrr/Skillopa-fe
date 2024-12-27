import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";

import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";

import {
  deleteLecture,
  setCurrChapterIndex,
  setCurrLectureData,
  setCurrLectureIndex,
  setIsEditMode,
  setRenderLectureForm,
} from "redux/slice/course";

export default function ChapterItem(props) {
  const { lecture, active, chapterIndex, lectureIndex, viewOnly } = props;
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const isInstructor = profile?.role === "instructor";

  const handleEditClick = (e) => {
    if (!viewOnly && isInstructor) {
      e.stopPropagation();
      dispatch(setCurrChapterIndex(chapterIndex));
      dispatch(setCurrLectureIndex(lectureIndex));
      dispatch(setCurrLectureData(lecture));
      dispatch(setIsEditMode(true));
      dispatch(setRenderLectureForm());
    }
  };

  const handleDeleteClick = (e) => {
    if (!viewOnly && isInstructor) {
      e.stopPropagation();
      dispatch(deleteLecture({ chapterIndex, lectureIndex }));
    }
  };

  const getIcon = () => {
    switch (lecture.class) {
      case "Lecture":
        return <OndemandVideoOutlinedIcon fontSize="small" />;
      case "Quiz":
        return <QuizOutlinedIcon fontSize="small" />;
      case "Text":
        return <TextSnippetOutlinedIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={classnames(
        "flex justify-between gap-5 items-center xl:mx-6 group cursor-pointer",
      )}
    >
      <div className="flex gap-5 items-center">
        {getIcon()}
        <p
          className={classnames("break-all group-hover:text-labelText", {
            "underline text-primary": active,
          })}
        >
          {lecture.title}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {lecture.duration && (
          <p className="text-labelText text-sm">{lecture.duration}</p>
        )}
        {!viewOnly && isInstructor && (
          <div className="flex gap-3">
            <IconButton
              aria-label="edit"
              size="small"
              onClick={handleEditClick}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={handleDeleteClick}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

ChapterItem.propTypes = {
  lecture: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  chapterIndex: PropTypes.number.isRequired,
  lectureIndex: PropTypes.number.isRequired,
  viewOnly: PropTypes.bool,
};
