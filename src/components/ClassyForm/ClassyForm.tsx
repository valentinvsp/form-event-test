import React, { useState, useEffect, useRef } from 'react';
import { Input, InputType, FormState } from './ClassyClasses';
import { inputData } from './constants'

const ClassyForm: React.FC = () => {
    const [formData, setFormData] = useState<Input[]>();
    const formObject = useRef<FormState>();
    const renderCount = useRef(0);

    useEffect(() => {
        const state = new FormState(inputData);
        setFormData(state.getState());
        formObject.current = state;
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {
            target: { name, value },
        } = e;
        formObject.current?.setInputValue(name, value);
        setFormData(formObject.current?.getState());
    };

    renderCount.current = renderCount.current + 1;
    console.log(`render number ${renderCount.current}`);
    return (
        <form onChange={handleFormChange} onSubmit={e => e.preventDefault()} noValidate>
            {formData?.map(({ id, name, type, value, label }) => {
                if (type === InputType.Text || type === InputType.Email || type === InputType.Password)
                    return (
                        <div className="form-group" key={id}>
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
                    <input key={id} type="submit" className="btn btn-primary" value={value}/>
                );
                return <div key={666}>Warning! Incorect input type.</div>;
            })}
        </form>
    );
};

export default ClassyForm;
