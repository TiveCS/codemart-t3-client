import { useState, type ChangeEvent, type SetStateAction } from "react";

interface UseInputOptions<T> {
  isRequired: boolean;
  validate?: (value: T) => boolean;
}

function useInput<T>(
  defaultValue: T,
  options?: UseInputOptions<T>
): [
  T,
  (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  (value: SetStateAction<T>) => void,
  boolean
] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isValid, setIsValid] = useState(true);

  function onValueChangeHandler(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    e.preventDefault();

    const newValue = e.target.value as unknown as T;

    if (options?.isRequired && newValue === undefined) {
      setIsValid(false);
      return;
    }

    if (options?.validate && !options.validate(newValue)) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    setValue(newValue);
  }

  return [value, onValueChangeHandler, setValue, isValid];
}

export default useInput;
