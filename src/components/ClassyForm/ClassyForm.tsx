import React /* useRef */ from 'react';
import { InputField, InputType } from './form_fields_classes/InputFields';
import { SelectField } from './form_fields_classes/SelectFields';
import useFormState from './useFormState';
import { formFieldsData } from './constants';
import './ClassyForm.css';

const ClassyForm: React.FC = () => {
    const [
        formData,
        handleFormOnChange,
        handleFormBlur,
        formIsValid,
    ] = useFormState(formFieldsData);
    // const renderCount = useRef(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted');
        if (formIsValid()) console.log('all good here!');
        else console.log('check your inputs');
    };

    // TODO find out why counter increments by 2;
    // renderCount.current = renderCount.current + 1;
    // console.log(`render number ${renderCount.current}`);
    return (
        <form
            onChange={handleFormOnChange}
            onBlur={handleFormBlur}
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="form-group">
                <input
                    id={formData.fieldsObject.username?.id}
                    type={formData.fieldsObject.username?.type}
                    className="form-control"
                    name={formData.fieldsObject.username?.name}
                    value={formData.fieldsObject.username?.value}
                    readOnly
                />
                <small id="emailHelp" className="form-text text-muted">
                    This one is readOnly.
                </small>
            </div>
            <div className="form-group">
                <input
                    id={formData.fieldsObject.username?.id}
                    type={formData.fieldsObject.username?.type}
                    className="form-control"
                    name={formData.fieldsObject.username?.name}
                    value={formData.fieldsObject.username?.value}
                    disabled
                />
                <small id="emailHelp" className="form-text text-muted">
                    This one is disabled.
                </small>
            </div>
            {formData?.fieldsArray.map(field => {
                if (field instanceof InputField) {
                    const {
                        id,
                        name,
                        type,
                        value,
                        checked,
                        label,
                        validationError,
                        touched,
                        valid,
                        placeholder,
                    } = field;
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
                                    placeholder={placeholder}
                                />
                                <small
                                    id="emailHelp"
                                    className="form-text text-muted"
                                >
                                    We'll never share your email with anyone
                                    else.
                                </small>
                                {touched && !valid && (
                                    <small className="form-text input-error validation-error">
                                        {validationError}
                                    </small>
                                )}
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
                                <label
                                    className="form-check-label"
                                    htmlFor={name}
                                >
                                    {label}
                                </label>
                                {touched && !valid && (
                                    <small className="form-text input-error validation-error">
                                        {validationError}
                                    </small>
                                )}
                            </div>
                        );
                    if (type === InputType.Radio)
                        return (
                            <div
                                key={id}
                                className="form-check form-check-inline"
                            >
                                <input
                                    type={type}
                                    className="form-check-input"
                                    id={id}
                                    name={name}
                                    checked={checked}
                                    value={value}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={name}
                                >
                                    {label}
                                </label>
                                {touched && !valid && (
                                    <small className="form-text input-error validation-error">
                                        {validationError}
                                    </small>
                                )}
                            </div>
                        );
                }
                if (field instanceof SelectField) {
                    const { id, options, label } = field;
                    return (
                        <div className="form-group mt-3" key={id}>
                            <label htmlFor={id}>{label}</label>
                            <select className="form-control" id={id}>
                                {options.map(o => (
                                    <option key={o}>{o}</option>
                                ))}
                            </select>
                        </div>
                    );
                }
                return <div key={666}>Warning! Incorect input type.</div>;
            })}
        </form>
    );
};

export default ClassyForm;
