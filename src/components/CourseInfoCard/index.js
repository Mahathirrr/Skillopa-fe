import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import CourseInfoPopover from "../CourseInfoPopover";
import { getInstructors, getYouTubeThumbnail, getCoursePrice } from "src/utils";

const CourseInfoCard = (props) => {
  const router = useRouter();
  const { course } = props;

  const handleClick = () => router.push(`/course/${course.slug}`);

  return (
    <CourseInfoPopover course={course}>
      <div onClick={handleClick} className="cursor-pointer">
        <Image
          src={getYouTubeThumbnail(course.previewMedia)}
          alt={course.title}
          width="300"
          height="170"
          objectFit="cover"
        />
        <div className="text-base pb-3">
          <h2>{course.title}</h2>
          <p className="text-labelText text-sm">{getInstructors(course)}</p>
          <p className="font-medium">{getCoursePrice(course)}</p>
        </div>
      </div>
    </CourseInfoPopover>
  );
};

export default CourseInfoCard;
