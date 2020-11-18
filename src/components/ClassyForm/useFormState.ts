import { useState, useEffect, useRef } from 'react';
import { FormState, Input, /* InputValue */ } from './ClassyClasses';

export default function useFormState(inputData: Input[]): [ Input[], (e: React.ChangeEvent<HTMLFormElement>) => void ] {
    const [form, setForm] = useState<Input[]>([]);
    const formRef = useRef<FormState>()

    useEffect(() => {
        const createdForm = new FormState(inputData)
        setForm(createdForm.getState());
        formRef.current = createdForm;
    }, [])

    // const updateForm = (inputName: string, newValue: InputValue) => {
    //     formRef.current?.setInputValue(inputName, newValue);

    // }

    const updateForm = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {
            target: { name, value },
        } = e;
        if (formRef.current) {
            formRef.current.setInputValue(name, value);
            setForm(formRef.current.getState());
        }    
    };

    return [form, updateForm];
}

