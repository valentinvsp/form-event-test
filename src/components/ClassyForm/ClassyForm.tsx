import React, { useState, useEffect, useRef } from 'react';
import { Input, InputType, FormState } from './ClassyClasses';

const ClassyForm: React.FC = () => {
    const [formData, setFormData] = useState<Input[]>();
    const formObject = useRef<FormState>();
    const renderCount = useRef(0);

    useEffect(() => {
        const state = new FormState(
            new Input({
                name: 'username',
                type: InputType.Text,
                label: 'Enter Username:',
            })
        );
        state.addInput(
            new Input({
                name: 'email',
                type: InputType.Email,
                label: 'Enter Email:',
            })
        );
        state.addInput(
            new Input({
                name: 'password',
                type: InputType.Password,
                label: 'Enter Password:',
            })
        );
        state.addInput(
            new Input({
                name: 'submit button',
                type: InputType.Button,
                value: 'SUBMIT',
            })
        );
        setFormData(state.getState());
        formObject.current = state;
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {
            target: { name, value },
        } = e;
        formObject.current?.changeInput(name, value);
        setFormData(formObject.current?.getState());
    };

    renderCount.current = renderCount.current + 1;
    console.log(`render number ${renderCount.current}`);
    return (
        <form onChange={handleFormChange} onSubmit={e => e.preventDefault()} noValidate>
            {formData?.map(({ name, type, value, label }) => {
                if (type === InputType.Text || type === InputType.Email || type === InputType.Password)
                    return (
                        <div className="form-group" key={name}>
                            {label && <label htmlFor={name}>{label}</label>}
                            <input
                                type={type}
                                className="form-control"
                                id={name}
                                name={name}
                                value={value}
                                aria-describedby="emailHelp"
                            />
                            <small
                                id="emailHelp"
                                className="form-text text-muted"
                            >
                                We'll never share your email with anyone else.
                            </small>
                        </div>
                    );
                if (type === InputType.Button) return (
                    <input type="submit" className="btn btn-primary" value={value}/>
                );
                return null;
            })}
        </form>
    );
};

export default ClassyForm;
