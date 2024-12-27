export const isBrowser = () => typeof window !== "undefined";

export const getInitials = (name) =>
  name
    .split(" ")
    .map((name) => name[0])
    .join("");

export const getCourseDuration = (duration) => {
  if (duration) {
    const durationArray = duration.split(":");
    const hours = durationArray[0];
    const mins = durationArray[1];

    if (hours) {
      return `${hours} hours+`;
    }

    if (mins) {
      return `${mins} minutes`;
    }
  }

  return null;
};

export const getChapterDuration = (duration) => {
  if (duration) {
    const durationArray = duration.split(":");
    const hours = durationArray[0];
    const mins = durationArray[1];

    if (hours !== "00") {
      return `${hours}hr ${mins}min`;
    }

    if (mins) {
      return `${mins}min`;
    }
  }

  return null;
};

export const scrollElementIntoView = (id) => {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
    });
  }
};

export const getYouTubeVideoId = (url) => {
  if (!url) return null;

  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

export const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return "/assets/books.svg"; // Fallback to default image

  // Return high quality thumbnail
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getInstructors = (course) =>
  course?.instructors?.map((i) => i.name).join(", ");

export const getCoursePrice = (course) => {
  if (!course?.pricing || course.pricing === "Free") {
    return "Free";
  }
  return course.currency && course.price
    ? `${course.currency} ${course.price}`
    : "Free";
};
