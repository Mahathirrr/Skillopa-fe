export const timeToSeconds = (time) => {
  if (!time) return 0;
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + (seconds || 0);
};

export const secondsToTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

export const calculateTotalDuration = (lectures) => {
  if (!lectures?.length) return "00:00:00";

  const totalSeconds = lectures.reduce((total, lecture) => {
    return total + timeToSeconds(lecture.duration);
  }, 0);
  return secondsToTime(totalSeconds);
};

export const getChapterDuration = (duration) => {
  if (!duration) return null;
  const [hours, minutes] = duration.split(":");

  if (hours !== "00") {
    return `${parseInt(hours)}hr ${parseInt(minutes)}min`;
  }
  if (minutes) {
    return `${parseInt(minutes)}min`;
  }
  return null;
};

export const getCourseDuration = (duration) => {
  if (!duration) return null;
  const [hours, minutes] = duration.split(":");
  if (hours !== "00") {
    return `${parseInt(hours)} hours`;
  }
  if (minutes) {
    return `${parseInt(minutes)} minutes`;
  }
  return null;
};

export const calculateCourseStats = (curriculum) => {
  if (!curriculum?.length) {
    return {
      totalChapters: 0,
      totalLectures: 0,
      totalDuration: "00:00:00",
    };
  }
  const totalChapters = curriculum.length;
  const totalLectures = curriculum.reduce((total, chapter) => {
    return total + chapter.content.length;
  }, 0);
  let totalSeconds = 0;
  curriculum.forEach((chapter) => {
    chapter.content.forEach((lecture) => {
      totalSeconds += timeToSeconds(lecture.duration);
    });
  });
  return {
    totalChapters,
    totalLectures,
    totalDuration: secondsToTime(totalSeconds),
  };
};

export const getInstructors = (course) => {
  if (!course?.instructors?.length) return "";

  return course.instructors.map((instructor) => instructor.name).join(", ");
};
