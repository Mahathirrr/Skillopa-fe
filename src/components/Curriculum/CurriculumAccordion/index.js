import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import ChapterItem from "../ChapterItem";
import { calculateTotalDuration, getChapterDuration } from "src/utils/duration";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
});

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1.3),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CurriculumAccordion(props) {
  const { viewOnly, handleItemClick, activeChapterItem } = props;
  const [expandedPanels, setExpandedPanels] = useState([]);
  const { data } = useSelector((state) => state.courses.course);

  useEffect(() => {
    if (activeChapterItem && data?.curriculum) {
      const chapterIndex = data.curriculum.findIndex((chapter) =>
        chapter.content.some((item) => item._id === activeChapterItem._id),
      );
      if (chapterIndex !== -1 && !expandedPanels.includes(chapterIndex)) {
        setExpandedPanels((prev) => [...prev, chapterIndex]);
      }
    }
  }, [activeChapterItem, data?.curriculum, expandedPanels]);

  const handleAccordionChange = (index) => (event, newExpanded) => {
    event.stopPropagation();
    setExpandedPanels((prevPanels) => {
      if (newExpanded) {
        return [...prevPanels, index];
      }
      return prevPanels.filter((panel) => panel !== index);
    });
  };

  const renderLectures = (lectures, chapterIndex) => {
    return lectures.map((lecture, index) => {
      const handleClick = (event) => {
        event.stopPropagation();
        if (typeof handleItemClick === "function") {
          handleItemClick(lecture);
        }
      };

      return (
        <AccordionDetails
          className={classnames("cursor-pointer hover:bg-gray-50")}
          onClick={handleClick}
          key={lecture._id || index}
        >
          <ChapterItem
            lecture={lecture}
            active={activeChapterItem?._id === lecture._id}
            chapterIndex={chapterIndex}
            lectureIndex={index}
            viewOnly={viewOnly}
          />
        </AccordionDetails>
      );
    });
  };

  const renderChapter = (chapter, index) => {
    const totalLectures = chapter.content.length;
    const chapterDuration = calculateTotalDuration(chapter.content);
    const totalDuration = getChapterDuration(chapterDuration);
    const lectureText = totalLectures === 1 ? "lecture" : "lectures";

    return (
      <div className="border border-solid border-border" key={index}>
        <Accordion
          expanded={expandedPanels.includes(index)}
          onChange={handleAccordionChange(index)}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary>
            <div className="flex flex-col gap-1 w-full pl-2">
              <p className="text-body break-all font-semibold">
                {chapter.chapterTitle}
              </p>
              <div className="flex gap-2 items-center text-labelText text-sm">
                <p>
                  {totalLectures} {lectureText}
                </p>
                {totalDuration && <p>• {totalDuration}</p>}
              </div>
            </div>
          </AccordionSummary>
          {chapter?.content && renderLectures(chapter.content, index)}
        </Accordion>
      </div>
    );
  };

  return (
    <div>
      {data?.curriculum.map((chapter, index) => renderChapter(chapter, index))}
    </div>
  );
}
