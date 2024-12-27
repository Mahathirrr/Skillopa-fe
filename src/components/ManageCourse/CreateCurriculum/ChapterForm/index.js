import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "src/components/Button";
import Input from "src/components/Input";

import { addChapter, editChapter } from "redux/slice/course";

const ChapterForm = () => {
  const dispatch = useDispatch();
  const { isEditMode, currChapterData } = useSelector(
    (state) => state.courses.course,
  );

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      chapterTitle: "",
      duration: "",
    },
  });

  useEffect(() => {
    if (isEditMode && currChapterData) {
      setValue("chapterTitle", currChapterData.chapterTitle);
      setValue("duration", currChapterData.duration || "");
    } else {
      reset({
        chapterTitle: "",
        duration: "",
      });
    }
  }, [isEditMode, currChapterData, setValue, reset]);

  const onSubmit = (data) => {
    if (isEditMode) {
      dispatch(editChapter({ data }));
    } else {
      dispatch(addChapter({ data }));
    }
    reset();
  };

  return (
    <div className="flex flex-col gap-3 h-min">
      <h2 className="text-lg font-semibold">
        {isEditMode ? "Edit Chapter" : "Add new Chapter"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Controller
          name="chapterTitle"
          control={control}
          rules={{
            required: "Chapter title is required.",
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

export default ChapterForm;
