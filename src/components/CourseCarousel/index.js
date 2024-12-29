import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { motion } from "framer-motion";

import CourseInfoCard from "../CourseInfoCard";
import ShimmerBlock from "../ShimmerBlock";

const CourseCarousel = (props) => {
  const { data, title, loading } = props;

  const renderSlides = () => {
    if (loading) {
      return new Array(5).fill(1).map((item, id) => (
        <SwiperSlide key={id}>
          <ShimmerBlock className="w-full h-36" />
        </SwiperSlide>
      ));
    }

    return data?.map((course, index) => (
      <SwiperSlide key={index}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CourseInfoCard course={course} />
        </motion.div>
      </SwiperSlide>
    ));
  };

  const renderTitle = () => {
    if (title) {
      if (loading) {
        return <ShimmerBlock className="w-72 h-6 rounded" />;
      }

      return (
        <motion.h2
          className="font-comedik text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {`${title} Courses`}
        </motion.h2>
      );
    }
  };

  return (
    <div className="my-12">
      <div className="mb-6">{renderTitle()}</div>
      <Swiper
        breakpoints={{
          600: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          700: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {renderSlides()}
      </Swiper>
    </div>
  );
};

export default CourseCarousel;
