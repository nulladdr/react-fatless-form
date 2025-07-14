import React from 'react';
import * as yup from "yup";
import { IoCalendarNumberSharp, IoTimeSharp, IoEye, IoEyeOff } from "react-icons/io5";
import './App.css';

import { FormProvider, useForm, handleSubmit, Input, FeedbackContainer, feedbackManager } from "react-fatless-form";

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required"),

  age: yup
    .number()
    .typeError("Age must be a number")
    .min(18, "Must be at least 18")
    .required("Age is required"),

  dateAvailable: yup
    .date()
    .nullable()
    .typeError("Must be a valid date")
    .optional(),

  quittingTime: yup
    .string()
    .required("Time is required"),

  password: yup
    .string()
    .required("Password is required"),

  relevantFiles: yup
    .array()
    .of(
      yup.mixed<File>().test("fileType", "Invalid file type", (file) =>
        file
          ? ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(file.type)
          : true
      ).test("fileSize", "File is too large", (file) =>
        file ? file.size <= 2 * 1024 * 1024 : true
      )
    )
    .min(1, "At least one file must be availed")
    .required("This field is required"),

  preferredCountriesOfWork: yup
    .array()
    .of(
      yup
        .string()
        .typeError("Each item must be a string")
        .required("Country is required")
    )
    .min(1, "At least one country must be selected")
    .required("This field is required"),
});

type FormData = yup.InferType<typeof schema>

function App() {
  const form = useForm<FormData>({
    username: "",
    age: 18,
    dateAvailable: null,
    quittingTime: "",
    password: "",
    relevantFiles: [],
    preferredCountriesOfWork: [],
});

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      
      await handleSubmit(
          form,
          schema,
          async (values) => {
              console.log(values);
              return { message: "Form submitted successfully" };
          },
      );
  };

  const resetClickHandler = () => {
    form.resetForm();
    feedbackManager.addFeedback("Form was reset", { type: "alert", autoDismiss: true }); // <=== Feedback of type "alert"
  };

  return (
    <>
    <div className="App">
      <FormProvider form={form}>
          <form onSubmit={onSubmit} data-theme="dark">
              <Input name="username" type="text" label="Username" placeholder="Your username" />
              <Input name="age" type="number" label="Age" placeholder="Your age" />
              <Input name="dateAvailable" type="date" label="Date Available" minDate={new Date} timePicker minTime='08:00' maxTime='16:30' dateFormat='MMMM dd, yyyy' noWeekends rightIcon={<IoCalendarNumberSharp color='#ccc' />} />
              <Input name="quittingTime" type="time" label="Quitting time" minTime="3:00 PM" maxTime="4:30 PM" rightIcon={<IoTimeSharp color='#ccc' />} />
              <Input name="preferredCountriesOfWork" type="select" label="Preferred Countries" options={[
                  {label: "Kenya", value: "ke"},
                  {label: "Ethiopia", value: "et"},
                  {label: "Nigeria", value: "ng"},
                  {label: "South Africa", value: "sa"}
              ]} placeholder="Select countries" multiple />
              <Input name="password" type="password" label="Password" placeholder="Password" showIcon={<IoEye color='#ccc' />} hideIcon={<IoEyeOff color='#ccc' />} />
              <Input name="relevantFiles" type="file" label="Relevant files" accept=".doc,.docx" multiple />

              <button className="submitButton" type="submit">Submit</button>
              <button className="resetButton" type="reset" onClick={resetClickHandler}>Reset</button>
          </form>
      </FormProvider>
    </div>
    <FeedbackContainer />
    </>
  );
}

export default App;
