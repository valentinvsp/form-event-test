import React, { /* useRef */ } from 'react';
import { InputType } from './ClassyClasses';
import useFormState from './useFormState';
import { inputData } from './constants';

const ClassyForm: React.FC = () => {
    const [formData, handleFormOnChange, handleFormBlur, formIsValid ] = useFormState(inputData);
    // const renderCount = useRef(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted');
        if ( formIsValid()) console.log('all good here!');
        else console.log('check your inputs');
    };

    // TODO find out why counter increments by 2;
    // renderCount.current = renderCount.current + 1;
    // console.log(`render number ${renderCount.current}`);
    return (
        <form onChange={handleFormOnChange} onBlur={handleFormBlur} onSubmit={handleSubmit} noValidate>
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
                                id={id}
                                type={type}
                                className="form-control"
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
                        <div key={id} className="form-group">
                        <input
                            id={id}
                            type="submit"
                            className="btn btn-primary mt-3"
                            value={value}
                        />
                        </div>
                    );
                if (type === InputType.Checkbox)
                    return (
                        <div key={id} className="form-group form-check">
                            <input
                                type={type}
                                className="form-check-input"
                                id={id}
                                name={name}
                                checked={checked}
                            />
                            <label className="form-check-label" htmlFor={name}>
                                {label}
                            </label>
                            {touched && !valid && <small
                                className="form-text input-error"
                            >
                                {validationError}
                            </small>}
                        </div>
                    );
                if (type === InputType.Radio)
                    return (
                        <div key={id} className="form-check form-check-inline">
                            <input
                                type={type}
                                className="form-check-input"
                                id={id}
                                name={name}
                                checked={checked}
                                value={value}
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
