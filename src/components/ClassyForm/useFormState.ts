import { useState, useEffect, useRef } from 'react';
import { FormState, Input, InputType } from './ClassyClasses';

type hookReturn = [ Input[], (e: React.ChangeEvent<HTMLFormElement>) => void, (e: React.FocusEvent<HTMLFormElement>) => void, (arg0: Input[]) => void ];

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
        const {
            target: { name, value, type },
        } = e;
        
        if (formRef.current) {
            if (type === InputType.Checkbox) {
                formRef.current.toggleInputChecked(name);
                e.stopPropagation();
                // Warning! Preventing default on checkboxes will break the desired beahvior.
            }
            else {
                formRef.current.setInputValue(name, value);
                e.preventDefault();
            }
            setForm(formRef.current.getState());
        }    
    };

    const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
        console.log(`${e.target.name} blurred`)
        e.preventDefault();
        if (formRef.current) {
            formRef.current.touchInput(e.target.name);
            setForm(formRef.current.getState());
        }
    }

    return [form, updateForm, handleBlur, createForm];
}

