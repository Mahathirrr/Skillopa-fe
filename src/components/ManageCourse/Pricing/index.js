import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";

import Input from "src/components/Input";
import DropdownInput from "src/components/DropdownInput";
import FormPageLayout from "src/components/FormPageLayout";

import { updateCourse } from "redux/slice/course";

const Pricing = ({ setIsPristine }) => {
  const dispatch = useDispatch();
  const {
    data,
    update: { loading },
  } = useSelector((state) => state.courses.course);

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      details: {
        pricing: "Free",
        currency: "IDR",
        price: "",
      },
    },
  });

  const watchPricing = watch("details.pricing");

  useEffect(() => {
    setValue("details", {
      pricing: data?.pricing,
      currency: data?.currency,
      price: data?.price,
    });
  }, [data, setValue]);

  useEffect(() => {
    setIsPristine(!isDirty);
  }, [setIsPristine, isDirty]);

  const onSubmit = (formData) => {
    dispatch(
      updateCourse({
        ...formData.details,
        price:
          formData.details.pricing === "Free" ? "" : formData.details?.price,
        _id: data._id,
      }),
    );
    setIsPristine(true);
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <p>
          How do you intend to offer your course? Select the monetization
          option.
        </p>
        <FormControl component="fieldset">
          <Controller
            rules={{ required: true }}
            control={control}
            name="details.pricing"
            render={({ field }) => (
              <RadioGroup {...field} row defaultValue="Free" name="pricing">
                <FormControlLabel
                  value="Free"
                  control={<Radio />}
                  label="Free"
                />
                <FormControlLabel
                  value="Paid"
                  control={<Radio />}
                  label="Paid"
                />
              </RadioGroup>
            )}
          />
        </FormControl>

        {watchPricing === "Paid" && (
          <>
            <Alert severity="info" className="mb-4">
              For paid courses, you&apos;ll need to set up your bank account
              details in the Settings tab to receive payments.
            </Alert>
            <div className="flex items-center gap-5">
              <Controller
                name="details.currency"
                control={control}
                rules={{
                  required: "Currency is required.",
                }}
                render={({ field, fieldState: { error } }) => (
                  <DropdownInput
                    data={["IDR"]}
                    error={!!error}
                    helperText={error ? error.message : null}
                    value={field.value}
                    handleChange={field.onChange}
                    valueExtractor={(datum) => datum}
                    labelExtractor={(datum) => datum}
                    containerClass="w-24"
                  />
                )}
              />
              <Controller
                name="details.price"
                control={control}
                rules={{
                  required: "Price is required.",
                  min: {
                    value: 10000,
                    message: "Minimum price is IDR 10,000",
                  },
                  max: {
                    value: 2000000,
                    message: "Maximum price is IDR 2,000,000",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Price"
                    type="number"
                    placeholder="100000"
                    error={!!error}
                    helperText={error ? error.message : null}
                    required
                    {...field}
                  />
                )}
              />
            </div>
            <p className="text-sm text-gray-500">
              Note: Price must be between IDR 10,000 and IDR 2,000,000
            </p>
          </>
        )}
      </form>
    );
  };

  return (
    <FormPageLayout
      title="Pricing"
      handleSave={handleSubmit(onSubmit)}
      loading={loading}
    >
      {renderForm()}
    </FormPageLayout>
  );
};

export default Pricing;
