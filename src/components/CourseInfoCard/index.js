import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import CourseInfoPopover from "../CourseInfoPopover";
import { getInstructors, getYouTubeThumbnail, getCoursePrice } from "src/utils";

const CourseInfoCard = (props) => {
  const router = useRouter();
  const { course } = props;

  const handleClick = () => router.push(`/course/${course.slug}`);

  return (
    <CourseInfoPopover course={course}>
      <motion.div
        onClick={handleClick}
        className="bg-tertiaryBg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
        whileHover={{ y: -5 }}
      >
        <div className="relative">
          <Image
            src={getYouTubeThumbnail(course.previewMedia)}
            alt={course.title}
            width={300}
            height={170}
            objectFit="cover"
            className="rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-comedik text-lg font-bold text-white mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-secondaryText text-sm mb-2">
            {getInstructors(course)}
          </p>
          <p className="font-bold text-primary">{getCoursePrice(course)}</p>
        </div>
      </motion.div>
    </CourseInfoPopover>
  );
};

export default CourseInfoCard;
