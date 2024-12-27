import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import Button from "src/components/Button";
import DropdownInput from "src/components/DropdownInput";
import Input from "src/components/Input";
import RichTextEditor from "src/components/RichTextEditor";

import { addLecture, editLecture } from "redux/slice/course";

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");

  const paddedHours = hours.padStart(2, "0");
  const paddedMinutes = minutes.padStart(2, "0");
  const paddedSeconds = seconds.padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

const LectureForm = () => {
  const dispatch = useDispatch();
  const { isEditMode, currLectureData } = useSelector(
    (state) => state.courses.course,
  );

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      class: "",
      duration: "",
      embedUrl: "",
      textContent: "",
    },
  });

  const contentClass = watch("class");
  const embedUrl = watch("embedUrl");

  useEffect(() => {
    if (embedUrl && contentClass === "Lecture") {
      const videoId = getYouTubeVideoId(embedUrl);
      if (videoId) {
        fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.items && data.items[0]) {
              const duration = formatDuration(
                data.items[0].contentDetails.duration,
              );
              setValue("duration", duration);
            }
          })
          .catch((error) =>
            console.error("Error fetching video duration:", error),
          );
      }
    }
  }, [embedUrl, contentClass, setValue]);

  useEffect(() => {
    if (isEditMode && currLectureData) {
      setValue("title", currLectureData.title);
      setValue("class", currLectureData.class);
      setValue("duration", currLectureData.duration || "");
      setValue("embedUrl", currLectureData.embedUrl || "");
      setValue("textContent", currLectureData.textContent || "");
    } else {
      reset({
        title: "",
        class: "",
        duration: "",
        embedUrl: "",
        textContent: "",
      });
    }
  }, [isEditMode, currLectureData, setValue, reset]);

  const onSubmit = (data) => {
    if (isEditMode) {
      dispatch(editLecture({ data }));
    } else {
      dispatch(addLecture({ data }));
    }
    reset();
  };

  return (
    <div className="flex flex-col gap-3 h-min">
      <h2 className="text-lg font-semibold">
        {isEditMode ? "Edit Chapter Item" : "Add new Chapter Item"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Controller
          name="title"
          control={control}
          rules={{
            required: "Title is required.",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters.",
            },
            maxLength: {
              value: 80,
              message: "Title must be maximum 80 characters.",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              label="Title"
              type="text"
              placeholder="Title"
              error={!!error}
              helperText={error ? error.message : null}
              required
              {...field}
              className="w-full"
            />
          )}
        />

        <div className="flex items-center gap-5">
          <Controller
            name="class"
            control={control}
            rules={{
              required: "Class Type is required.",
            }}
            render={({ field, fieldState: { error } }) => (
              <DropdownInput
                label="Class Type"
                data={[
                  { title: "Lecture" },
                  { title: "Quiz" },
                  { title: "Text" },
                ]}
                error={!!error}
                helperText={error ? error.message : null}
                required
                value={field.value}
                handleChange={field.onChange}
                valueExtractor={(datum) => datum.title}
                labelExtractor={(datum) => datum.title}
                containerClass="w-1/2 mt-3"
              />
            )}
          />

          {contentClass === "Lecture" && (
            <Controller
              name="duration"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Duration (Auto-detected)"
                  type="time"
                  inputProps={{ step: 2 }}
                  placeholder="duration"
                  error={!!error}
                  helperText={error ? error.message : null}
                  disabled
                  {...field}
                  className="w-1/2"
                />
              )}
            />
          )}
        </div>

        {(contentClass === "Lecture" || contentClass === "Quiz") && (
          <Controller
            name="embedUrl"
            control={control}
            rules={{
              required: "YouTube URL is required for video content.",
              pattern: {
                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                message: "Please enter a valid YouTube URL",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="YouTube URL"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                error={!!error}
                helperText={error ? error.message : null}
                required
                {...field}
                className="w-full"
              />
            )}
          />
        )}

        {contentClass === "Text" && (
          <Controller
            name="textContent"
            control={control}
            rules={{
              required: "Text content is required.",
            }}
            render={({ field, fieldState: { error } }) => (
              <RichTextEditor
                label="Content"
                required
                {...field}
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => {
              reset();
              dispatch({ type: "courses/setIsEditMode", payload: false });
            }}
          />
          <Button label={isEditMode ? "Update" : "Add"} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default LectureForm;
