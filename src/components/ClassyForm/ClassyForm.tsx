import React, { useRef } from 'react';
import { InputType } from './ClassyClasses';
import useFormState from './useFormState';
import { inputData } from './constants';

const ClassyForm: React.FC = () => {
    const [formData, updateFormData, handleFormBlur ] = useFormState(inputData);
    const renderCount = useRef(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted');
    };

    renderCount.current = renderCount.current + 1;
    console.log(`render number ${renderCount.current}`);
    return (
        <form onChange={updateFormData} onBlur={handleFormBlur} onSubmit={handleSubmit} noValidate>
            {formData?.map(({ id, name, type, value, checked, label, validationError, touched, valid }) => {
                if (
                    type === InputType.Text ||
                    type === InputType.Email ||
                    type === InputType.Password
                )
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
                            {touched && !valid && <small
                                className="form-text input-error"
                            >
                                {validationError}
                            </small>}
                        </div>
                    );
                if (type === InputType.Button)
                    return (
                        <input
                            key={id}
                            type="submit"
                            className="btn btn-primary"
                            value={value}
                        />
                    );
                if (type === InputType.Checkbox)
                    return (
                        <div key={id} className="form-group form-check">
                            <input
                                type={type}
                                className="form-check-input"
                                id={name}
                                name={name}
                                checked={checked}
                            />
                            <label className="form-check-label" htmlFor={name}>
                                {label}
                            </label>
                        </div>
                    );
                return <div key={666}>Warning! Incorect input type.</div>;
            })}
        </form>
    );
};

export default ClassyForm;
