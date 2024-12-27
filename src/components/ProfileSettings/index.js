import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import IconButton from "@mui/material/IconButton";

import Input from "src/components/Input";
import Button from "src/components/Button";
import { getInitials } from "src/utils";
import { updateProfile } from "redux/slice/auth";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const {
    profile,
    updateProfile: { loading, error, success },
  } = useSelector((state) => state.auth);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: profile?.name || "",
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.name !== profile.name) {
      formData.append("name", data.name);
    }
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    if (formData.has("name") || formData.has("avatar")) {
      dispatch(updateProfile(formData));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4">
          Profile updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar
              alt={profile?.name}
              src={previewImage || profile?.avatar}
              sx={{ width: 100, height: 100 }}
            >
              {!previewImage &&
                !profile?.avatar &&
                profile &&
                getInitials(profile.name)}
            </Avatar>
            <label htmlFor="icon-button-file">
              <input
                accept="image/*"
                id="icon-button-file"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                className="absolute bottom-0 right-0 bg-white shadow-md"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </div>

          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                label="Name"
                placeholder="Your name"
                error={!!error}
                helperText={error?.message}
                required
                {...field}
                className="w-full"
              />
            )}
          />

          <Button
            type="submit"
            label="Save Changes"
            loading={loading}
            disabled={!isDirty && !selectedFile}
            className="w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
