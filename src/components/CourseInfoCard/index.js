import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import CourseInfoPopover from "../CourseInfoPopover";
import { getYouTubeThumbnail, getInstructors, getCoursePrice } from "src/utils";

const CourseInfoCard = ({ course }) => {
  const router = useRouter();

  const handleClick = () => router.push(`/course/${course.slug}`);

  return (
    <CourseInfoPopover course={course}>
      <motion.div
        onClick={handleClick}
        className="bg-tertiaryBg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full"
        whileHover={{ y: -5 }}
      >
        <div className="relative aspect-video">
          <Image
            src={getYouTubeThumbnail(course.previewMedia)}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-white line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>
          <p className="text-secondaryText text-sm line-clamp-1">
            {getInstructors(course)}
          </p>
          <p className="font-bold text-primary">{getCoursePrice(course)}</p>
        </div>
      </motion.div>
    </CourseInfoPopover>
  );
};

export default CourseInfoCard;
