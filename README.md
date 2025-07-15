# react-fatless-form  🥬

![License](https://img.shields.io/github/license/aderahenry/react-fatless-form) ![npm version](https://img.shields.io/npm/v/react-fatless-form)

_A lightweight React form library designed for simplicity that simplifies form handling and validation without unnecessary complexity or bloat._

`react-fatless-form` simplifies form management in React applications without leaving a huge footprint in your codebase. Whether you're building simple or complex forms, this package ensures a clean and intuitive experience with minimal setup.

## Why _fatless_?

This package doesn't come with any baggage. It doesn't bring along a laundry list of dependencies, doesn't leave a huge footprint in your codebase, and doesn't force you to deal with unnecessary complexity. It doesn't try to do everything - it's a clean, simple solution that just works.

That’s why I went with the name `react-fatless-form`. It’s my way of saying, “Hey, this is the lean form package you’ve been looking for.” No fluff, no bloated abstractions, and no over-engineered features you’ll never use. It’s light, sleek, and designed to keep your codebase as clean as possible while still delivering all the functionality you actually need.

Think of it as a form library that’s been on a diet :smile:. It’s still powerful, but it won’t weigh your project down. So if you’re looking for a form package that doesn't feel like dragging a sofa through your app, give `react-fatless-form` a shot. You’ll feel the difference right away.

## Features

- **Lightweight**: Minimal bundle size to keep your project fast.
- **Developer-Oriented**: Designed to make form handling straightforward for developers.
- **Just Works**: No unnecessary abstractions - integrate seamlessly into your workflow.
- **Minimal Footprint**: Clean and readable codebase integration.
- **Validation Support**: Built-in support for schema-based validation with [Yup].
- **Customizable**: Easily adaptable to your specific form needs.

## Design Philosophy

- **Separation of Concerns:** Modular handling of state, validation, and submission.
- **Flexibility:** Allows developers full control over the form lifecycle.
- **Future-Proofing:** Supports evolving workflows without tightly coupling form state with submission logic.

## Installation

To get started, install `react-fatless-form` and its peer dependency - [yup].

```bash
npm install react-fatless-form yup
```

or using Yarn:

```bash
yarn add react-fatless-form yup
```

## Provider

To use the package effectively, you need to wrap the relevant portion of your web app in the `FormProvider` component. This ensures that the form state, validation, and submission logic are available via React's context API to all components within the form.

The `FormProvider` component provides the `react-fatless-form` context to its children, enabling them to access and interact with the form state and lifecycle. Without the `FormProvider`, the components from `react-fatless-form` will not work correctly, as they rely on the context for managing form data.

To get started, import `FormProvider` and wrap your form in it. Pass the `form` instance (from the `useForm` hook) as a prop.

## Hooks

### `useForm`

The `useForm` hook is a robust and developer-friendly solution for managing form state, validation, submission lifecycle, and user interactions in React applications. This hook is highly flexible and can adapt to a wide variety of use cases while maintaining a clean and intuitive API.

### Features

- **Form State Management:** Tracks values, errors, and submission status.
- **Validation Workflow:** Integrates seamlessly with schema-based validation (e.g., [yup]).
- **Submission Lifecycle:** Provides functions to handle form submission and reset functionality.

### API Documentation

#### Signature

```typescript
function useForm<T>(initialValues: T): {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    submissionStatus: "idle" | "submitting" | "success" | "error";
    setFieldValue: (field: keyof T, value: T[keyof T]) => void;
    batchSetFieldValues: (values: Partial<T>) => void;
    setFieldArrayValue: (field: keyof T, value: string | string[]) => void;
    setFieldError: (field: keyof T, error: string) => void;
    setFieldTouched: (field: keyof T, touched: boolean) => void;
    validate: (validateFn: (values: T) => Partial<Record<keyof T, string>>) => boolean;
    resetForm: () => void;
    updateSubmissionStatus: (status: "idle" | "submitting" | "success" | "error") => void;
    resetSubmissionStatus: () => void;
};
```

#### Parameters

#### `initialValues: T`

**Description:** The initial state of the form’s values. Defines the default structure and data types of the form fields.
**Type:** `T` (generic type representing the shape of the form values)

#### Return value

The useForm hook returns an object containing the following **state**, and **functions**:

##### State

##### 1. `values: T`

The current state of the form’s values. Example:

```typescript
{ 
  username: "JohnDoe", 
  age: 25 
}
```

##### 2. `errors: Partial<Record<keyof T, string>>`

An object storing validation errors for each field. Example:

```typescript
{ 
  username: "Username is required" 
}
```

##### 3. `touched: Partial<Record<keyof T, boolean>>`

An object tracking whether a field has been interacted with. Example:

```typescript
{ 
  username: true 
}
```

##### 4. `submissionStatus:` "idle" | "submitting" | "success" | "error"

The current status of the form submission. Possible values:

- "idle": No submission in progress.
- "submitting": Submission is in progress.
- "success": Submission completed successfully.
- "error": An error occurred during submission.

##### Functions

##### 1. `setFieldValue(field: keyof T, value: T[keyof T]) => void`

Updates the value of a specific field. Example:

```typescript
form.setFieldValue("username", "JaneDoe")
```

##### 2. `batchSetFieldValues(values: Partial<T>) => void`

Updates multiple field values at once. Example:

```typescript
form.batchSetFieldValues({ username: "JaneDoe", age: 30 });
```

##### 3. `setFieldArrayValue(field: keyof T, value: string | string[]) => void`

Sets the value of a field as a string or an array of strings. Example:

```typescript
form.setFieldArrayValue("tags", ["React", "JavaScript"]);
```

##### 4. `setFieldError(field: keyof T, error: string) => void`

Sets an error message for a specific field. Example

```typescript
 form.setFieldError("username", "Username is required");
```

##### 5. `setFieldTouched(field: keyof T, touched: boolean) => void`

Marks a field as touched or untouched. Example:

```typescript
form.setFieldTouched("username", true);
```

##### 6. `validate(validateFn: (values: T) => Partial<Record<keyof T, string>>) => boolean`

Validates the form using a custom validation function. `validateFn` receives the current form values and returns an object with field-specific error messages. Returns `true` if validation passes (no errors), otherwise `false`.

##### 7. `resetForm() => void`

Resets the form’s values, errors, and touched fields to their initial state. Example:

```typescript
form.resetForm();
```

##### 8. `updateSubmissionStatus(status: "idle" | "submitting" | "success" | "error") => void`

Updates the submissionStatus to reflect the current state of submission. Example:

```typescript
form.updateSubmissionStatus("submitting");
```

##### 9. `resetSubmissionStatus() => void`

Resets the submissionStatus to "idle". Example:

```typescript
form.resetSubmissionStatus()
```

>:no_good_man: Leaving the form in a `"success"` or `"error"` state can cause issues when using `useForm` in multiple places. For example, submission-related logic tied to `"idle"` won't execute if the form never returns to the `"idle"` state. You must ensure `resetSubmissionStatus` is called to reset the form's state. More on this later.

#### Example usage

>:love_you_gesture: This example will be used throughout the remaining documentation, undergoing progressive refinements.

```tsx
import { FormProvider, useForm } from "react-fatless-form";

function MyForm() {
    const { 
      validate, 
      values,
      errors, 
      updateSubmissionStatus, 
      resetForm, 
      resetSubmissionStatus,
      setFieldValue,
      setFieldTouched,
    } = useForm({ username: "", age: 0 });

    const validateFn = values => {
        const errors = {};
        if (!values.username) errors.username = "Username is required";
        if (values.age <= 0) errors.age = "Age must be positive";
        return errors;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (!validate(() => validateFn(values))) {
            console.warn("Validation failed");
            return;
        }
        
        updateSubmissionStatus("submitting");
        
        try {
            await apiCall(values);
            updateSubmissionStatus("success");
            resetForm();
        } catch (error) {
            console.error("Error during submission:", error);
            updateSubmissionStatus("error");
        } finally {
            resetSubmissionStatus();
        }
    };

    return (
        <FormProvider form={form}>
            <form onSubmit={onSubmit}>
                <input
                    value={values.username}
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    onBlur={() => setFieldTouched("username", true)}
                />
                {errors.username && <span>{errors.username}</span>}
    
                <input
                    type="number"
                    value={values.age}
                    onChange={(e) => setFieldValue("age", parseInt(e.target.value, 10))}
                    onBlur={() => setFieldTouched("age", true)}
                />
                {errors.age && <span>{errors.age}</span>}
    
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}
```

### `useFormContext`

The `useFormContext` hook provides access to the shared form state and actions from the closest FormProvider. It’s essential when building custom form components that need to read or update form values, errors, or status outside of standard inputs.

### Purpose

Use this hook when:

- You’re building reusable form fields or wrappers
- You need programmatic access to form state or behavior inside nested components
- You want to avoid prop-drilling in large forms

### Type Safety

You can optionally provide a type parameter for full type inference of form values and actions:

```typescript
const form = useFormContext<MyFormValues>()
```

### API Documentation

#### Signature

```typescript
function useFormContext<T>(): UseForm<T>
```

Where `UseForm<T>` includes all state and actions like:

- `values`, `errors`, `touched`, `submissionStatus`
- `setFieldValue`, `setFieldError`, `validate`, `resetForm`, etc.

#### Example usage

>:warning: `useFormContext` must be called inside a component wrapped with `FormProvider`. Calling it outside this context will throw an error to prevent misuse.

```tsx
import { useFormContext } from 'react-fatless-form'

type MyFormValues = {
  email: string
}

function EmailInput() {
  const form = useFormContext<MyFormValues>()
  const value = form.values.email ?? ''
  const error = form.errors.email
  const touched = form.touched.email

  return (
    <>
      <input
        type='email'
        value={value}
        onChange={e => form.setFieldValue('email', e.target.value)}
        onBlur={() => form.setFieldTouched('email', true)}
      />
      {touched && error && <span style={{ color: 'red' }}>{error}</span>}
    </>
  )
}
```

## Utilities

### `FeedbackManager`

The **FeedbackManager** class is a centralized utility for managing feedback notifications - specifically toasts and alerts, with features like auto-dismissal, customizable durations, and fade-out animations. It follows a subscription-based model, making it easy to integrate with UI components for real-time feedback updates.

#### Features

- **Supports Feedback Types:** "toast" and "alert".
- **Visual Variants:** "info", "success", "error", and "warning".
- **Auto-Dismiss Functionality:** Configurable durations for automatic dismissal of feedback.
- **Fade-Out Animations:** Handles graceful removal with fade-out effects.
- **Subscription Model:** Provides real-time updates to registered listeners.
- **UI Integration:** Works seamlessly with the FeedbackContainer component for rendering feedback notifications.

#### API Documentation

#### Types

```typescript
type FeedbackVariant = "info" | "success" | "error" | "warning";

// Represents a single feedback notification.
interface Feedback {
    id: number;
    message: string;
    type: "toast" | "alert";
    variant: FeedbackVariant;
    autoDismiss?: boolean;
    duration?: number;
    onClose?: () => void;
    isFadingOut: boolean;
}

// Optional configuration for the addFeedback method.
interface FeedbackOptions = {
    type?: "toast" | "alert"; // Type of feedback (default: "toast")
    variant?: FeedbackVariant; // Visual variant (default: "info")
    autoDismiss?: boolean; // Whether the feedback should dismiss automatically (default: true)
    duration?: number; // Duration in milliseconds for auto-dismissal (default: 5000ms)
    onClose?: () => void; // Callback executed when the feedback is removed
}
```

#### Methods

#### 1. `addFeedback(message: string, options?: FeedbackOptions): void`

Adds a new feedback notification to the list.

##### Parameters

- `message: string` - The feedback message to display.
- `options: FeedbackOptions` - Optional configuration object

#### 2. `removeFeedback(id: number): void`

Removes feedback immediately and triggers its onClose callback, if provided.

##### Parameters

- `id: number`: Unique identifier of the feedback to be removed.

#### 3. `subscribe(listener: (feedbacks: Feedback[]) => void): () => void`

Registers a listener for real-time feedback updates.

##### Parameters

- `listener: (feedbacks: Feedback[]) => void`: Callback function invoked with the current list of feedbacks.

##### Returns

A function to unsubscribe the listener.

#### Internal Methods

#### 1. `startFadeOut(id: number): void`

Initiates the fade-out animation for a feedback notification before removing it.

#### 2. `notifyListeners(): void`

Notifies all registered listeners of feedback updates.

#### Usage

##### Mounting the Feedback Container

The `FeedbackContainer` component listens for updates and renders feedback notifications appropriately. Add it once to your application, typically in your app's root component.

```tsx
import { FeedbackContainer } from 'react-fatless-form';

function App() {
  return (
    <div>
      <YourMainContent />
      <FeedbackContainer />
    </div>
  );
}
```

The component uses `ReactDOM.createPortal` to render notifications at the root of `document.body`.

##### Importing and Instantiating

```typescript
import { feedbackManager } from 'react-fatless-form';
```

##### Adding Feedback

```typescript
feedbackManager.addFeedback("Operation successful!", {
  type: "toast",
  variant: "success",
  autoDismiss: true,
  duration: 5000,
  onClose: () => console.log("Feedback closed!"),
});
```

##### Subscribing to Feedback Updates

```typescript
const unsubscribe = feedbackManager.subscribe(feedbacks => {
  console.log("Current feedbacks:", feedbacks);
});

// Unsubscribe when no longer needed
unsubscribe();
```

##### Example Integration with UI

```tsx
import { FeedbackContainer, feedbackManager } from 'react-fatless-form';

const App = () => {
  const handleClick = () => {
    feedbackManager.addFeedback("This is a success message!", {
      type: "toast",
      variant: "success",
      duration: 3000,
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Show Feedback</button>
      <FeedbackContainer />
    </div>
  );
};
```

#### Example usage

```tsx
import { FormProvider, useForm, feedbackManager } from "react-fatless-form";

function MyForm() {
    const { 
      validate, 
      values, 
      errors,
      updateSubmissionStatus, 
      resetForm, 
      resetSubmissionStatus,
      setFieldValue,
      setFieldTouched,
    } = useForm({ username: "", age: 0 });

    const validateFn = values => {
        const errors = {};
        if (!values.username) errors.username = "Username is required";
        if (values.age <= 0) errors.age = "Age must be positive";
        return errors;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (!validate(() => validateFn(values))) {
            console.warn("Validation failed");
            return;
        }
        
        updateSubmissionStatus("submitting");
        
        try {
            await apiCall(values);
            updateSubmissionStatus("success");
            
            feedbackManager.addFeedback("Submission successful!", {
                type: "toast",
                variant: "success",
                autoDismiss: true,
                duration: 5000,
                onClose: () => console.log("Feedback closed!"),
            });
            
            resetForm();
        } catch (error) {
            console.error("Error during submission:", error);
            updateSubmissionStatus("error");
            
            feedbackManager.addFeedback("That didn't go well!", {
                type: "toast",
                variant: "error",
                autoDismiss: true,
                duration: 5000,
                onClose: () => console.log("Feedback closed!"),
            });
        } finally {
            resetSubmissionStatus();
        }
    };

    return (
        <FormProvider form={form}>
            <form onSubmit={onSubmit}>
                <input
                    name="username"
                    value={values.username}
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    onBlur={() => setFieldTouched("username", true)}
                />
                {errors.username && <span>{errors.username}</span>}
    
                <input
                    name="age"
                    type="number"
                    value={values.age}
                    onChange={(e) => setFieldValue("age", parseInt(e.target.value, 10))}
                    onBlur={() => setFieldTouched("age", true)}
                />
                {errors.age && <span>{errors.age}</span>}
    
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}
```

#### Notes

- The `FeedbackManager` is a singleton instance provided by the `react-fatless-form`.
- To display feedback notifications, ensure the `FeedbackContainer` component is mounted in your application - typically in your app's root component.
- Fade-out animations provide a smooth user experience and are automatically handled before feedback removal.

### `validateSchema`

The `validateSchema` utility function is a simple and efficient tool for validating form values against a schema defined using the [yup] validation library. It provides a structured way to collect validation errors, making it easy to integrate with form handling workflows.

#### API Documentation

#### Signature

```typescript
function validateSchema<T extends Record<string, any>>(
    schema: yup.ObjectSchema<T>, 
    values: T,
    abortEarly: boolean = false
): Partial<Record<keyof T, string>>
```

#### Parameters

##### 1. `schema: yup.ObjectSchema<T>`

The validation schema defining the rules for the form fields. This is a yup object schema tailored to the structure of the values being validated.

##### 2. `values: T`

The object containing the form field values to be validated against the schema.

##### 3. `abortEarly: boolean`

Whether to stop at the first validation error (`true`) or collect all errors (`false` - default).

#### Return value

An object containing validation errors. Each key represents the name of an invalid field, and its value is the corresponding error message. If no validation errors are found, an empty object `{}` is returned.

#### Behavior

##### Validation Process

- The `validateSchema` function uses the `schema.validateSync()` method from [yup] to perform validation.
- The `abortEarly: false` option ensures all errors are collected, not just the first one.

##### Error Handling

- If the validation fails, the errors are collected from the inner property of the `yup.ValidationError` object.
- The errors are returned as a flat object, where each field’s name is mapped to its corresponding error message.

#### Example usage

```tsx
import * as yup from "yup";
import { FormProvider, useForm, feedbackManager, validateSchema } from "react-fatless-form";

// Define a schema
const schema = yup.object({
    username: yup.string().required("Name is required"),
    age: yup.number().min(18, "Must be at least 18").required("Age is required"),
});

function MyForm() {
    const { 
      validate, 
      values,
      errors,  
      updateSubmissionStatus, 
      resetForm, 
      resetSubmissionStatus,
      setFieldValue,
      setFieldTouched,
    } = useForm({ username: "", age: 0 });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (!validate(() => validateSchema(schema, values))) {
            console.warn("Validation failed");
            return;
        }
        
        updateSubmissionStatus("submitting");
        
        try {
            await apiCall(values);
            updateSubmissionStatus("success");
            
            feedbackManager.addFeedback("Submission successful!", {
                type: "toast",
                variant: "success",
                autoDismiss: true,
                duration: 5000,
                onClose: () => console.log("Feedback closed!"),
            });
            
            resetForm();
        } catch (error) {
            console.error("Error during submission:", error);
            updateSubmissionStatus("error");
            
            feedbackManager.addFeedback("That didn't go well!", {
                type: "toast",
                variant: "error",
                autoDismiss: true,
                duration: 5000,
                onClose: () => console.log("Feedback closed!"),
            });
        } finally {
            resetSubmissionStatus();
        }
    };

    return (
        <FormProvider form={form}>
            <form onSubmit={onSubmit}>
                <input
                    name="username"
                    value={values.username}
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    onBlur={() => setFieldTouched("username", true)}
                />
                {errors.username && <span>{errors.username}</span>}
    
                <input 
                    name: "age"
                    type="number"
                    value={values.age}
                    onChange={(e) => setFieldValue("age", parseInt(e.target.value, 10))}
                    onBlur={() => setFieldTouched("age", true)}
                />
                {errors.age && <span>{errors.age}</span>}
    
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}
```

### `handleSubmit`

The `handleSubmit` utility simplifies form submissions in React applications by integrating schema-based validation, submission status management, and optional feedback notifications. Designed to work seamlessly with the `useForm` hook, it reduces boilerplate code and enforces best practices for managing the form lifecycle.

#### Features

- **Schema-Based Validation:** Ensures form data adheres to a defined structure using [yup].
- **Submission Status Updates:** Automatically updates form status ("submitting", "success", "error") for improved user feedback and state management.
- **Configurable Feedback Handling:** Allows developers to control success and error messages through feedbackConfig.
- **Promise-Based API:** Fully compatible with async/await for smooth integration.

#### API Documentation

#### Signature

```typescript
function handleSubmit<T extends Record<string, any>>(
    form: ReturnType<typeof useForm<T>>,
    schema: yup.ObjectSchema<T>,
    onSubmit: (values: T) => Promise<void>,
    onSuccess?: () => void,
    feedbackConfig?: {
        successMessage?: string;
        errorMessage?: string;
        showFeedback?: boolean;
    }
): Promise<void>
```

#### Parameters

- `form: ReturnType<typeof useForm<T>>` - The form object returned by the `useForm` hook.
- `schema: yup.ObjectSchema<T>` - A [yup] schema defining the structure and constraints of form values.
- `onSubmit: (values: T) => Promise<void>` - An async callback for form submission logic. Receives validated form values as an argument.
- `onSuccess?: () => void` - Optional callback to execute after a successful submission. Useful for closing modals, refetching, etc.
- `feedbackConfig?: { successMessage?: string; errorMessage?: string; showFeedback?: boolean; }` - Optional configuration object for feedback handling.

  - `successMessage?: string` - A success message displayed upon successful submission. Defaults to "Done!".
  - `errorMessage?: string` - A custom error message to display when submission fails.
  - `showFeedback?: boolean` - Controls whether feedback notifications are displayed. Defaults to true.

#### Returns

`Promise<void>` - Resolves when the submission process is complete.

#### Usage

##### Schema Definition with [yup]

```typescript
import * as yup from "yup";
import { useForm } from "react-fatless-form";

// Define a schema
const schema = yup.object({
    username: yup.string().required("Name is required"),
    age: yup.number().min(18, "Must be at least 18").required("Age is required"),
});
```

##### Basic Integration

```typescript
import { useForm, handleSubmit } from 'react-fatless-form';

const form = useForm({ username: "", age: 0 });

const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    
    await handleSubmit(
        form,
        schema,
        async (values) => {
            const result = await api.submitData(values);
            if (!result.ok) throw result;
        },
        { successMessage: "Submission successful!" }
    );
};
```

##### Customizing Error Messages

```typescript
await handleSubmit(
    form,
    schema,
    async (values) => {
        const result = await api.submitData(values);
        if (!result.ok) throw result;
    },
    { successMessage: "Successfully submitted!", errorMessage: "Submission failed. Please try again." }
);
```

##### Disabling Feedback

```typescript
import { useForm, feedbackManager } from 'react-fatless-form';

const form = useForm({ username: "", age: 0 });

const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    await handleSubmit(
        form,
        schema,
        async (values) => {
            const result = await api.submitData(values);
            if (!result.ok) throw result;
        },
        { showFeedback: false }
    );

    // Custom feedback handling
    feedbackManager.addFeedback("Submission successful!", {
        type: "toast",
        variant: "success",
        autoDismiss: true,
        duration: 5000,
        onClose: () => form.resetSubmissionStatus(),
    });
};
```

#### Best Practices

##### Resetting Submission Status

When feedback is disabled, ensure that the form’s submission status is reset to "idle" after a submission. This avoids issues with multiple uses of `useForm`.

```typescript
form.resetSubmissionStatus();
```

##### Custom Feedback

Leverage `feedbackManager` or your own UI for personalized user feedback. The flexibility of `feedbackConfig` empowers developers to craft unique experiences while adhering to state management requirements.

#### Example usage

```tsx
import * as yup from "yup";
import { FormProvider, useForm, handleSubmit } from "react-fatless-form";

// Define a schema
const schema = yup.object({
    username: yup.string().required("Name is required"),
    age: yup.number().min(18, "Must be at least 18").required("Age is required"),
});

function MyForm() {
    const form = useForm({ username: "", age: 0 });

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        await handleSubmit(
            form,
            schema,
            async (values) => {
                const result = await api.submitData(values);
                if (!result.ok) throw result;
            },
            { successMessage: "Submission successful!" }
        );
    };

    return (
        <FormProvider form={form}>
            <form onSubmit={onSubmit}>
                <input
                    name="username"
                    value={form.values.username}
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    onBlur={() => setFieldTouched("username", true)}
                />
                {form.errors.username && <span>{form.errors.username}</span>}
    
                <input
                    name="age"
                    type="number"
                    value={form.values.age}
                    onChange={(e) => setFieldValue("age", parseInt(e.target.value, 10))}
                    onBlur={() => setFieldTouched("age", true)}
                />
                {form.errors.age && <span>{form.errors.age}</span>}
    
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}
```

#### Why Choose `handleSubmit`?

- **Reduced Boilerplate:** Automates validation, submission status updates, and feedback management.
- **Flexibility:** Customize feedback or rely on built-in options.
- **Best Practices:** Encourages clean, predictable form handling with clear state transitions.

## Components

### `Input` :nerd_face:

The `Input` component is a versatile and self-sufficient form control designed to handle a wide variety of input scenarios. It dynamically adapts its behavior based on the _type_ prop and comes with built-in features to simplify form management.

#### Features

##### 1. Dynamic Type Handling

Renders different input types (text, number, password, email, etc.) based on the _type_ prop.

##### 2. Custom Datepicker, Date/Time picker and Timepicker

- Includes a fully custom datepicker, date/time picker and a sandalone timepicker component, eliminating the need for external libraries.
- Provides an intuitive UI for date, date/time and time selection.

##### 3. Custom Drag-and-Drop file picker

- Features a built-in drag-and-drop interface for file uploads.
- Supports multiple file uploads
- Displays selected file names, and has the feature to select and remove

##### 4. Integrated Form State Management

- Automatically binds to form fields, handling _value_ and _onChange_ props.
- Manages field state and validation seamlessly.

##### 5. Developer-Friendly

- Fully self-sufficient and requires no external dependencies for advanced features like datepickers or drag-and-drop file uploads.
- Provides a simple API, allowing developers to focus on configuration without worrying about state management or third-party library integration.

##### 6. Customizable and Themed

- Supports custom styles via _className_ and _style_ props.
- Adapts to form-level and global styling conventions.

##### 7. Type-Safe Props

Each input type enforces its own specific props, ensuring valid usage.

#### Supported Input Types

- **Text-based Inputs**: Includes `text`, `number`, `password`, etc.
- **Textarea**: Multi-line text input with options for rows, columns, and wrapping.
- **Checkbox**: Supports both standalone checkboxes and grouped checkboxes.
- **Radio Buttons**: Renders a group of mutually exclusive options.
- **Select Dropdown**: A dropdown menu with options for single or multiple selection.
- **Date Picker**: Renders a date input with optional minimum and maximum date constraints.
- **Date/Time Picker**: Renders a date input with an optional time picker if the `timePicker` prop is set to `true`.
- **Time Picker**: Renders a time input with optional minimum and maximum time constraints.
- **File Input**: For uploading files, with support for specifying file types and allowing multiple file uploads.

##### Common Props

| Prop            | Type                                   | Description                                                                                       |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `name`        | `string` (required)                                    | The name of the input field, used for form state binding.                           |
| `label`      | `string` (required)                        | The label text displayed for the input field. |
| `disabled`      | `boolean` (optional)         | Disables the input field if true.          |
| `required`| `boolean` (optional)                               | Marks the input field as required.                     |
| `className` | `string` (optional) |Adds custom CSS classes to the input field for styling.|
| `style` | `React.CSSProperties` (optional) | Adds inline styles for the input field. |

##### Type-Specific Props

###### Text Inputs (type: "text" | "number" | "password")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `placeholder`        | `string`                                   | Placeholder text for the input.                   |
| `autofocus`      | `boolean`                        | Automatically focuses the input field on mount. |

###### Textarea (type: "textarea")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `cols`        | `number`                                   | Number of columns for the textarea.                   |
| `rows`      | `number`                        | Number of rows for the textarea. |
| `wrap` | `string`| "hard" or "soft" - Specifies how the text in a text area is to be wrapped when submitted in a form|
| `readonly` | `boolean` | Prevents modification of the text if true. |
| `maxlength` | `number` | Maximum number of characters allowed. |

###### Checkbox (type: "checkbox")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `checked`        | `boolean`                                   | Indicates if the checkbox is selected.               |
| `options`      | `{ label: string; value: any }[]`                        | Array of checkbox options for grouped checkboxes. |
| `slider` | `string` | "rounded" or "default" - If provided, renders a single checkbox as a switch. "default" renders a rounded switch. "rounded" renders a rounded switch. |

###### Behavior

###### :point_right: Single Checkbox

- If `options` is not provided, it renders a single checkbox.
- If `slider` is provided, the checkbox is styled as a switch.

###### :point_right: Multiple Checkboxes

- If `options` is provided and has at least one item, it renders a list of checkboxes. 
- If `options` is empty, the component renders nothing.

##### Radio Buttons (type: "radio")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `checked`        | `boolean`                                   | Indicates if the checkbox is selected.               |
| `options`      | `{ label: string; value: any }[]`                        | Array of radio button options. |

##### Select Dropdown (type: "select")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `options`        | `{ label: string; value: any }[]`                                   | Array of dropdown options.               |
| `loading`      | `boolean`                        | Displays a loading indicator if true. |
| `multiple` | `boolean` |  Enables multi-selection if `true`. |
| `placeholder` | `string` | Placeholder text for the dropdown. |

##### Date Input (type: "date")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `minDate`        | `Date`                                   | Minimum selectable date.               |
| `maxDate`      | `Date`                        | Maximum selectable date. |
| `timePicker`   | `boolean` | Whether to include a time picker along with the date input. |
| `minTime`      | `string`                        | The earliest time that can be selected (format: `HH:MM`). Only applicable when `timePicker` is true. Example: `09:00` restricts selection to 9AM or later. |
| `maxTime`      | `string`                        | The latest time that can be selected (format: `HH:MM`). Only applicable when `timePicker` is true. Example: `16:00` restricts selection to 4PM or earlier. |
| `dateFormat` | `string` | The format to display dates in the input field. Options: `MM/dd/yyyy`, `dd/MM/yyyy`, `yyyy-MM-dd`, `MMMM dd, yyyy` and `LLL dd, yyyy`. Defaults to `dd/MM/yyyy` |
| `noWeekends` | `boolean` | When true, disables selection of weekend dates (Saturday and Sunday). Defaults to `false` |
| `rightIcon` | `React.JSX.Element` | An optional icon or element to display on the right side of the input field. |
| `placeholder` | `string` | Placeholder text for the date input. |

##### Time Input (type: "time")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `minTime`        | `string`                                   | Minimum selectable time.               |
| `maxTime`      | `string`                        | Maximum selectable time. |
| `rightIcon` | `React.JSX.Element` | An optional icon or element to display on the right side of the input field. |
| `placeholder` | `string` | Placeholder text for the time input. |

##### Password Input (type: "password")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `showStrengthIndicator`        | `boolean`                                   | Whether to show the strength indicator. Defaults to true.               |
| `passwordPolicy`      | `(password: string) => { strength: number; message: string }`                        | Custom password policy function. If not provided, a default policy will take effect |
| `showIcon` | `React.JSX.Element` | Icon for showing the password. |
| `hideIcon` | `React.JSX.Element` | Icon for hiding the password. |
| `placeholder` | `string` | Placeholder text for the password input. |

##### File Input (type: "file")

| Prop            | Type                                   | Description                                                                                      |
|------------------|----------------------------------------|--------------------------------------------------------------------------------------------------|
| `accept`        | `string`                                   | Accepted file types (e.g., .pdf, .docx).               |
| `multiple`      | `boolean`                        | Allows selection of multiple files if true. |

#### Examples

##### 1. Text Input

```tsx
<Input name="username" type="text" label="Username" placeholder="Enter your username" />
```

##### 2. Single Checkbox (Default)

```tsx
<Input
    name="acceptTerms"
    type="checkbox"
    label="Accept Terms and Conditions"
/>
```

##### 3. Single Checkbox (Slider)

```tsx
<Input
    name="darkMode"
    type="checkbox"
    label="Enable Dark Mode"
    slider="rounded"
/>
```

##### 4. Multiple Checkboxes

```tsx
<Input
    name="preferences"
    type="checkbox"
    label="Choose Preferences"
    options={[
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
    ]}
/>
 ```

##### 5. Date Input

```tsx
<Input
   value={new Date()} // Pre-select today's date
   onChange={(date) => console.log('Selected Date:', date)} // Handle date selection
   minDate={new Date()} // Restrict to no past dates
   maxDate={new Date(2080, 11, 31)} // Allow dates only up to Dec 31, 2080
   dateFormat="MMMM dd, yyyy" // Use long month name format
   noWeekends // Disable selection of weekend dates (Saturday and Sunday)
   timePicker // Enable time selection
   minTime="09:00" // Restrict times to 9AM or later
   maxTime="16:00" // Restrict times to 4PM or earlier
   className="custom-date-input" // Add custom styling to the input field
 />
```

##### 6. Time Input

```tsx
    <Input
        name="time"
        type="time"
        label="Select Time"
        minTime="09:00 AM"
        maxTime="05:00 PM"
        placeholder="Select time"
    />
```

##### 7. File Input

```tsx
<Input name="files" type="file" label="Relevant Files" accept=".pdf,.docx" multiple />
```

## Theme Support

`react-fatless-form` supports light and dark themes via the `data-theme` attribute. This makes it easy to integrate into your design system, including frameworks like MUI, Tailwind, or custom setups.

### Defaults

If no data-theme is specified:

- The form components default to light mode
- All color variables have explicit fallbacks, so the form works reliably even with no theme setup
- You don’t need to configure anything to get started

### Enabling Dark Mode

To enable dark mode, add `data-theme="dark"` to any parent element:

```typescript
<form data-theme="dark">
    <Input ...>
</form>
```

Or to apply theme globally across your app:

```typescript
<div data-theme="dark">
  <Form ... />
</div>
```

You are not limited to using the form tag. Any ancestor element can define the theme using `data-theme`.

## Full Usage Example :sparkles:

```tsx
import * as yup from "yup";
import { FormProvider, useForm, handleSubmit, Input } from "react-fatless-form";

// Define a schema
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

function MyForm() {
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
                const result = await api.submitData(values);
                if (!result.ok) throw result;
            },
            { successMessage: "Submission successful!" }
        );
    };

    return (
        <>
            <FormProvider form={form}>
                <form onSubmit={onSubmit} data-theme="dark">
                    <Input 
                        name="username" 
                        type="text" 
                        label="Username" 
                        placeholder="Your username" 
                    />
                    <Input 
                        name="age" 
                        type="number" 
                        label="Age" 
                        placeholder="Your age" 
                    />
                    <Input 
                        name="dateAvailable" 
                        type="date" 
                        label="Date Available" 
                        minDate={new Date} 
                        timePicker 
                        minTime='08:00' 
                        maxTime='16:30' 
                        dateFormat='MMMM dd, yyyy' 
                        noWeekends 
                        rightIcon={<IoCalendarNumberSharp color='#ccc' />} 
                    />
                    <Input 
                        name="quittingTime" 
                        type="time" 
                        label="Quitting time" 
                        minTime="3:00 PM" 
                        maxTime="4:30 PM" 
                        rightIcon={<IoTimeSharp color='#ccc' />} 
                    />
                    <Input 
                        name="preferredCountriesOfWork" 
                        type="select" 
                        label="Preferred Countries" 
                        options={[
                            {label: "Kenya", value: "ke"},
                            {label: "Ethiopia", value: "et"},
                            {label: "Nigeria", value: "ng"},
                            {label: "South Africa", value: "sa"}
                        ]} 
                        placeholder="Select countries" 
                        multiple 
                    />
                    <Input 
                        name="password" 
                        type="password" 
                        label="Password" 
                        placeholder="Password" 
                        showIcon={<IoEye color='#ccc' />} 
                        hideIcon={<IoEyeOff color='#ccc' />} 
                    />
                    <Input 
                        name="relevantFiles" 
                        type="file" 
                        label="Relevant files" 
                        accept=".doc,.docx" 
                        multiple 
                    />

                    <button className="submitButton" type="submit">Submit</button>
                    <button className="resetButton" type="reset" onClick={resetClickHandler}>Reset</button>
                </form>
            </FormProvider>
            <FeedbackContainer />
        </>
    );
}
```

## Tech

`react-fatless-form` uses three open source projects to work properly:

- [React] - The library for web and native user interfaces
- [React DOM] - Serves as the entry point to the DOM and server renderers for React
- [Yup] - A schema builder for runtime value parsing and validation.

## License

### MIT

I'm super chill about how you use this software, basically letting you do whatever you want with it, even for commercial purposes – it's the definition of open source freedom! Just be sure to include the provided license.

[Adera Henry], with :heart: from Nairobi, Kenya

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[React]: <https://www.npmjs.com/package/react/>
[React DOM]: <https://www.npmjs.com/package/react-dom/>
[yup]: <https://www.npmjs.com/package/yup>
[Adera Henry]: <https://www.linkedin.com/in/aderahenry/>
