import React from 'react';
import logo from './logo.svg';
import './App.css';

import { object, string, number, date, array, InferType } from 'yup';

import { FormProvider, useForm, handleSubmit, Input } from "react-fatless-form";

// Define a schema
const schema = object({
    username: string()
        .required("Name is required"),
    age: number()
        .typeError("Age must be a number")
        .min(18, "Must be at least 18")
        .required("Age is required"),
    dateAvailable: date()
        .typeError("Must be a valid date")
        .required("Availability date is required"),
    relevantFiles: array()
        .required("This field is required")
        .min(1, "At least one file must be availed")
        .test("fileType", "Invalid file type", (files) => {
            if (!files || files.length === 0) return true;
            return files
                .every((file) => ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]
                .includes(file.type));
        })
        .test("fileSize", "File is too large", (files) => {
            if (!files || files.length === 0) return true;
            return files
                .every((file) => file.size <= 2 * 1024 * 1024); // Max 2MB
        }),
    preferredCountriesOfWork: array()
        .of(string()
            .typeError("Each item must be a string")
            .required("Country is required")
        )
        .min(1, "At least one country must be selected")
        .required("This field is required")
});

function App() {
  const form = useForm({ 
    username: "", 
    age: 18, 
    dateAvailable: new Date(),
    relevantFiles: [],
    preferredCountriesOfWork: [],
});

const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    await handleSubmit(
        form,
        schema,
        async (values) => {
            console.log('Form values >>> ', values)
        },
        "Submission successful!"
    );
};

  return (
    <div className="App">
    <FormProvider form={form}>
        <form onSubmit={onSubmit}>
            <Input name="username" type="text" label="Username" placeholder="Your username" />
            <Input name="age" type="number" label="Age" placeholder="Your age" />
            <Input name="dateAvailable" type="date" label="Commencement Date" />
            <Input name="relevantFiles" type="file" label="Relevant files" accept=".doc,.docx" multiple />
            <Input name="preferredCountriesOfWork" type="select" label="Preferred Countries" options={[
                {label: "Kenya", value: "ke"},
                {label: "Ethiopia", value: "et"},
                {label: "Nigeria", value: "ng"},
                {label: "South Africa", value: "sa"},
            ]} placeholder="Select countries" multiple />

            <button type="submit">Submit</button>
        </form>
    </FormProvider>
    </div>
  );
}

export default App;
