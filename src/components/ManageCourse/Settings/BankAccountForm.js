import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Input from "src/components/Input";
import DropdownInput from "src/components/DropdownInput";

const banks = [
  "Bank BCA",
  "Bank Mandiri",
  "Bank BNI",
  "Bank BRI",
  "Bank CIMB Niaga",
  "Bank Permata",
  "Bank Danamon",
  "Bank OCBC NISP",
  "Bank Syariah Indonesia",
];

const BankAccountForm = ({ bankAccount, onBankAccountChange }) => {
  const { control, setValue } = useForm({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
    },
  });

  useEffect(() => {
    if (bankAccount) {
      setValue("bankName", bankAccount.bankName);
      setValue("accountNumber", bankAccount.accountNumber);
      setValue("accountHolderName", bankAccount.accountHolderName);
    }
  }, [bankAccount, setValue]);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-semibold">Bank Account Details</h3>
      <Controller
        name="bankName"
        control={control}
        rules={{ required: "Bank name is required" }}
        render={({ field, fieldState: { error } }) => (
          <DropdownInput
            label="Bank Name"
            data={banks}
            error={!!error}
            helperText={error?.message}
            required
            value={field.value}
            handleChange={(e) => {
              field.onChange(e);
              onBankAccountChange({
                bankName: e.target.value,
                accountNumber: control._formValues.accountNumber,
                accountHolderName: control._formValues.accountHolderName,
              });
            }}
            valueExtractor={(bank) => bank}
            labelExtractor={(bank) => bank}
          />
        )}
      />

      <Controller
        name="accountNumber"
        control={control}
        rules={{
          required: "Account number is required",
          pattern: {
            value: /^\d+$/,
            message: "Please enter a valid account number",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <Input
            label="Account Number"
            type="text"
            error={!!error}
            helperText={error?.message}
            required
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onBankAccountChange({
                bankName: control._formValues.bankName,
                accountNumber: e.target.value,
                accountHolderName: control._formValues.accountHolderName,
              });
            }}
          />
        )}
      />

      <Controller
        name="accountHolderName"
        control={control}
        rules={{ required: "Account holder name is required" }}
        render={({ field, fieldState: { error } }) => (
          <Input
            label="Account Holder Name"
            type="text"
            error={!!error}
            helperText={error?.message}
            required
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onBankAccountChange({
                bankName: control._formValues.bankName,
                accountNumber: control._formValues.accountNumber,
                accountHolderName: e.target.value,
              });
            }}
          />
        )}
      />
    </div>
  );
};

export default BankAccountForm;
