import { useState, useEffect, useRef } from 'react';
import { FormState, Input } from './ClassyClasses';

type hookReturn = [ Input[], (e: React.ChangeEvent<HTMLFormElement>) => void, (arg0: Input[]) => void ];

export default function useFormState(inputData?: Input[]): hookReturn {
    const [form, setForm] = useState<Input[]>([]);
    const formRef = useRef<FormState>()

    useEffect(() => {
        createForm(inputData)
    }, [])

    const createForm = (inputData?: Input[]) => {
        const createdForm = new FormState(inputData)
        setForm(createdForm.getState());
        formRef.current = createdForm;
    }

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

    return [form, updateForm, createForm];
}

