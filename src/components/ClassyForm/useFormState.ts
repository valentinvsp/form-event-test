import { useState, useEffect, useRef } from 'react';
import { FormState, Input, InputType } from './ClassyClasses';

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
        console.log(e);
        const {
            target: { name, value, type },
        } = e;
        
        if (formRef.current) {
            if (type === InputType.Checkbox) {
                formRef.current.toggleInputChecked(name);
                // Warning! Preventing default on checkboxes will break the desired beahvior.
            }
            else {
                formRef.current.setInputValue(name, value);
                e.preventDefault();
            }
            setForm(formRef.current.getState());
        }    
    };

    return [form, updateForm, createForm];
}

