import { useState, useEffect, useRef } from 'react';
import { FormState, Input, InputType, FieldAttributes } from './ClassyClasses';

// TODO -> there is an issue with clicking away from a text input and onto a checkbox
//         that the onblur event triggers and works properly, but the checkbox does not get toggled.
//         it seems to only occur when validation fails and the validationError is displayed

// TODO -> Since we are using event delegation, the actual event being captured is on an Input target
//         but TypeScript does not allow having (e: React.ChangeEvent<HTMLInputElement>) to be assigned
//         to a <form> onChange prop. This leads to "value" and "type" as being typed 'any' instead of 'string'.
//         Find a way to correctly type these.
type hookReturn = [ Input[], (e: React.ChangeEvent<HTMLFormElement>) => void, (e: React.FocusEvent<HTMLFormElement>) => void, () => boolean, (arg0: Input[]) => void ];

/**
 * Takes information about the inputs you want in your form, and manages all the
 * state changes internally.
 * 
 * @param formFieldsData is the information needed to create a form. It can be of
 * type Input, Input[], InputAttributes[] or an Array with a mix of Input and InputAttributes.
 * 
 * @returns a tuple containing [ state, onChangeHandler(), onBlurHandler(), isFormValid(), createNewStateObject() ]
 */
export default function useFormState(formFieldsData?: FieldAttributes[]): hookReturn {
    const [form, setForm] = useState<Input[]>([]);
    const formRef = useRef<FormState>()

    useEffect(() => {
        createForm(formFieldsData)
    }, [formFieldsData])

    const createForm = (formFieldsData?: FieldAttributes[]) => {
        const createdForm = new FormState(formFieldsData)
        setForm(createdForm.getState());
        formRef.current = createdForm;
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const {
            target: { id, value, type },
        } = e;
        const form = formRef.current;

        if (form) {
            if (type === InputType.Checkbox) {
                form.toggleInputChecked(id);
                e.stopPropagation();
                // Warning! Preventing default on checkboxes will break the desired beahvior.
            } else if (type === InputType.Radio) {
                form.selectRadioInput(id);
                form.validateRadios();
                e.stopPropagation();
                // // Warning! Preventing default on checkboxes will break the desired beahvior.
            } else {
                form.setInputValue(id, value);
                e.preventDefault();
            }
            setForm(form.getState());
        }    
    };

    const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
        e.preventDefault();
        const type = e.target.type;
        if ( type === InputType.Radio || type === InputType.Button ) return;
        if (formRef.current) {
            formRef.current.touchInput(e.target.id);
            setForm(formRef.current.getState());
        }
    }

    const isFormValid = () => {
        if (formRef.current) {
            const valid =  formRef.current.isValid();
            setForm(formRef.current.getState());
            return valid;
        }
        else throw new Error('Cannot validate an uninitialized form.');
    }

    return [form, handleOnChange, handleBlur, isFormValid, createForm];
}

// TODO -> make this return a string
// function getIdFromEvent(event: React.BaseSyntheticEvent<HTMLElement>) {
//     let id: string = event.target.id;
//     if (!id) throw new Error(`Element ${event.target} does not have an "id" property,
//         which is required for the form to work properly.`)
//     return id;
// }
// The current inssue is with event type (TypesScript).

