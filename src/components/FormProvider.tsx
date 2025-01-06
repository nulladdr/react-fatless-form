import React from "react";
import { UseForm } from "../hooks/useForm";

interface FormProviderProps<T> {
  children: React.ReactNode;
  form: UseForm<T>;
}

export const FormContext = React.createContext<UseForm<any> | null>(null);

export function FormProvider<T>({ children, form }: FormProviderProps<T>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}
