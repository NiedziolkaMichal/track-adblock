import { useCallback, useId, useState } from "react";

export function useInputWithCallback(callback: (value: string) => void, getValueFromInput: (input: string) => string | undefined) {
  const fieldId = useId();
  const [completed, setCompleted] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const onAddId = useCallback(() => {
    const textField = document.getElementById(fieldId) as HTMLInputElement;
    const value = getValueFromInput(textField.value);
    if (value) {
      callback(value);
      setInvalid(false);
      setCompleted(true);
    } else {
      setInvalid(true);
    }
  }, [fieldId, setCompleted, setInvalid, callback, getValueFromInput]);

  return { fieldId, completed, invalid, onAddId };
}
