import { RefObject, useCallback, useEffect, useId, useState } from "react";

export function useInputWithCallback(callback: (value: string) => void, getValueFromInput: (input: string) => string | undefined) {
  const fieldId = useId();
  const [completed, setCompleted] = useState(false);
  const [invalid, setInvalid] = useState("");

  const onAddId = useCallback(() => {
    const textField = document.getElementById(fieldId) as HTMLInputElement;
    const value = getValueFromInput(textField.value);
    if (value) {
      callback(value);
      setInvalid("");
      setCompleted(true);
    } else {
      setInvalid("VALUE");
    }
  }, [fieldId, setCompleted, setInvalid, callback, getValueFromInput]);

  return { fieldId, completed, invalid, onAddId, setInvalid };
}

export function useOnHover(ref: RefObject<HTMLElement>, onMouseOver: () => void, onMouseLeave: () => void) {
  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }
    current.addEventListener("mouseover", onMouseOver);
    return () => current?.removeEventListener("mouseover", onMouseOver);
  }, [ref, onMouseOver, onMouseLeave]);

  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }
    current.addEventListener("mouseleave", onMouseLeave);
    return () => current?.removeEventListener("mouseleave", onMouseLeave);
  }, [ref, onMouseOver, onMouseLeave]);
}
