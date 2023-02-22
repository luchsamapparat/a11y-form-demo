import { useCallback, useState } from "react";

export function useFormState<T extends Record<string, unknown>>(initialFormState: T) {
    const [formState, setFormState] = useState<T>(initialFormState);

    const onChangeHandler = useCallback(
        (name: keyof T) => {
            return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                setFormState({ ...formState, [name]: event.target.value })
            }
        },
        [formState]
    );

    const reset = useCallback(() => setFormState(initialFormState), [initialFormState]);

    return [
        formState,
        onChangeHandler,
        reset
    ] as const;
}