import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { motion } from "framer-motion";
import CourseInfoCard from "../CourseInfoCard";
import CourseCardSkeleton from "../CourseCardSkeleton";

const CourseCarousel = ({ data, title, loading }) => {
  const renderSlides = () => {
    if (loading) {
      return Array(4)
        .fill(null)
        .map((_, index) => (
          <SwiperSlide key={`skeleton-${index}`}>
            <CourseCardSkeleton />
          </SwiperSlide>
        ));
    }

    return data?.map((course, index) => (
      <SwiperSlide key={course.id || index}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <CourseInfoCard course={course} />
        </motion.div>
      </SwiperSlide>
    ));
  };

  return (
    <div className="my-12">
      {title && (
        <motion.h2
          className="font-comedik text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {`${title} Courses`}
        </motion.h2>
      )}
      <Swiper
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        modules={[Navigation, Pagination]}
        className="!pb-12" // Padding untuk pagination bullets
      >
        {renderSlides()}
      </Swiper>
    </div>
  );
};

export default CourseCarousel;
