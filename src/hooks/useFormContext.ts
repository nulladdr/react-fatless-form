import { useContext } from "react";
import { FormContext } from "../components/FormProvider";
import { UseForm } from "./useForm";

export function useFormContext<T>(): UseForm<T> {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }

  return context as UseForm<T>
}
