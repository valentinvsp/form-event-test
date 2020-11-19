import { useState, useEffect, useRef } from 'react';
import { FormState, Input, InputOptions, InputType } from './ClassyClasses';

// TODO -> Since we are using event delegation, the actual event being captured is on an Input target
//         but TypeScript does not allow having (e: React.ChangeEvent<HTMLInputElement>) to be assigned
//         to a <form> onChange prop. This leads to "value" and "type" as being typed 'any' instead of 'string'.
//         Find a way to correctly type these.
type hookReturn = [ Input[], (e: React.ChangeEvent<HTMLFormElement>) => void, (e: React.FocusEvent<HTMLFormElement>) => void, (arg0: Input[]) => void ];

/**
 * Takes information about the inputs you want in your form, and manages all the
 * state changes internally.
 * 
 * @param inputData is the information needed to create a form. It can be of
 * type Input, Input[], InputOptions[] or an Array with a mix of Input and InputOptions.
 * 
 * @returns a tuple containing [ state, onChangeHandler, onBlurHandler, createNewStateObject ]
 */
export default function useFormState(inputData?: Input | Input[] | InputOptions[]): hookReturn {
    const [form, setForm] = useState<Input[]>([]);
    const formRef = useRef<FormState>()

    useEffect(() => {
        createForm(inputData)
    }, [inputData])

    const createForm = (inputData?: Input | Input[] | InputOptions[]) => {
        const createdForm = new FormState(inputData)
        setForm(createdForm.getState());
        formRef.current = createdForm;
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const {
            target: { id, value, type },
        } = e;

        if (formRef.current) {
            if (type === InputType.Checkbox) {
                formRef.current.toggleInputChecked(id);
                e.stopPropagation();
                // Warning! Preventing default on checkboxes will break the desired beahvior.
            } else if (type === InputType.Radio) {
                formRef.current.selectRadioInput(id);
                e.stopPropagation();
                // // Warning! Preventing default on checkboxes will break the desired beahvior.
            } else {
                formRef.current.setInputValue(id, value);
                e.preventDefault();
            }
            setForm(formRef.current.getState());
        }    
    };

    const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ( e.target.type === InputType.Radio) return;
        if (formRef.current) {
            formRef.current.touchInput(e.target.id);
            setForm(formRef.current.getState());
        }
    }

    return [form, handleOnChange, handleBlur, createForm];
}

// TODO -> make this return a string
// function getIdFromEvent(event: React.BaseSyntheticEvent<HTMLElement>) {
//     let id: string = event.target.id;
//     if (!id) throw new Error(`Element ${event.target} does not have an "id" property,
//         which is required for the form to work properly.`)
//     return id;
// }

