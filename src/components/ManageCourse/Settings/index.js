import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";

import DropdownInput from "src/components/DropdownInput";
import FormPageLayout from "src/components/FormPageLayout";
import BankAccountForm from "./BankAccountForm";

import { getAddedInstructors } from "redux/slice/instructor";
import { updateCourse } from "redux/slice/course";

const Settings = ({ setIsPristine }) => {
  const dispatch = useDispatch();
  const {
    data,
    update: { updating },
  } = useSelector((state) => state.courses.course);
  const { loading, instructors } = useSelector((state) => state.instructor);

  const [formData, setFormData] = useState({
    instructors: "",
    published: false,
    bankAccount: null,
  });

  useEffect(() => {
    if (!instructors.length) {
      dispatch(getAddedInstructors());
    }
  }, [dispatch, instructors]);

  useEffect(() => {
    if (data) {
      setFormData({
        instructors: data.instructors[0],
        published: data.published,
        bankAccount: data.instructors[0]?.bankAccount,
      });
    }
  }, [data]);

  const handleSave = () => {
    dispatch(
      updateCourse({
        ...formData,
        instructors: [formData.instructors],
        _id: data._id,
      }),
    );
    setIsPristine(true);
  };

  const handleBankAccountChange = (bankAccount) => {
    setFormData((prev) => ({ ...prev, bankAccount }));
    setIsPristine(false);
  };

  const renderField = (label, Component) => {
    return (
      <div className="grid md:grid-cols-2 items-center">
        <p className="text-labelText mb-1 md:mb-0">{label}</p>
        {Component}
      </div>
    );
  };

  return (
    <FormPageLayout title="Settings" handleSave={handleSave} loading={updating}>
      <div className="flex flex-col gap-8">
        {renderField(
          "Instructor",
          <DropdownInput
            data={instructors}
            loading={loading}
            value={formData.instructors}
            handleChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                instructors: e.target.value,
              }));
              setIsPristine(false);
            }}
            valueExtractor={(i) => i._id}
            labelExtractor={(i) => i.name}
          />,
        )}

        {renderField(
          "Course status",
          <div className="flex items-center gap-1">
            <p>Unpublished</p>
            <Switch
              checked={formData.published}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  published: e.target.checked,
                }));
                setIsPristine(false);
              }}
            />
            <p>Published</p>
          </div>,
        )}

        {data?.pricing === "Paid" && (
          <>
            <Alert severity="info">
              For paid courses, please provide your bank account details to
              receive payments.
            </Alert>
            <BankAccountForm
              bankAccount={formData.bankAccount}
              onBankAccountChange={handleBankAccountChange}
            />
          </>
        )}
      </div>
    </FormPageLayout>
  );
};

export default Settings;
