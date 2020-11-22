import { BaseField, BaseFieldAttributes } from './BaseField'

export type InputValue = string | number;

export enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password',
    Button = 'button',
    Checkbox = 'checkbox',
    Radio = 'radio',
}

export type InputAttributes = {
    type: InputType;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    checked?: boolean;
}

export type InputFieldAttributes = InputAttributes & BaseFieldAttributes;

export class InputField extends BaseField implements InputAttributes {
    type: InputType;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    checked?: boolean;

    constructor(attributes: InputAttributes & BaseFieldAttributes) {
        super(attributes);
        ({
            id: this.id,
            name: this.name,
            type: this.type,
            placeholder: this.placeholder,
            required: this.required,
            minLength: this.minLength,
            maxLength: this.maxLength,
            regex: this.regex,
            label: this.label,
            checked: this.checked,
        } = attributes);

        const { value, validationError } = attributes;
        this.value = value ? value : '';
        this.validationError = validationError ? validationError : 'Field is not valid.';
        
        this.valid = this.type === InputType.Radio ? true : this.isValid();

        if ((this.minLength || this.minLength === 0) &&(
                !(typeof this.minLength === 'number') || this.minLength <= 0 || !Number.isInteger(this.minLength)
                )
            ) throw new Error(`InputAttributes object containing id ${this.id} has an invalid "minLength" property.
            "minLength" should be an integer, greater or equal to 1.`);
            
        if ((this.maxLength || this.maxLength === 0) && (
                !(typeof this.maxLength === 'number') || this.maxLength <= 0 || !Number.isInteger(this.minLength)
                || (this.minLength && this.minLength > this.maxLength)
                )
            ) throw new Error(`InputAttributes object containing id ${this.id} has an invalid "maxLength" property.
            "maxLength" should be an integer, greater or equal to 1. If a "minLength property is set,
             it should be greater or equal to it.`);

        if (
            (this.type === InputType.Checkbox ||
            this.type === InputType.Radio) &&
            typeof this.checked === 'undefined'
        )
            this.checked = false;
        if (this.regex)
            if (
                !(
                    this.type === InputType.Text ||
                    this.type === InputType.Email ||
                    this.type === InputType.Password
                )
            )
                throw new Error(
                    `InputAttributes object containing id ${this.id} has a "regex" property,
                    but is not of an allowed "type" property. Allowed types are "text", "email" and "password".`
                );
        if (this.type === InputType.Radio && typeof this.name === 'undefined') throw new Error(
            `InputAttributes object containing id ${this.id} has a "type" property of "radio", but is not assigned a "name" property.
            Radio buttons need a "name" property to work properly.`
        );
    }

    // TODO -> Handle validit checks for checkboxes (if required) and radios (if none is selected and one should be)
    isValid() {
        if ((this.type === InputType.Text || this.type === InputType.Email || this.type === InputType.Password) && this.required && !this.value)
            return false;
        if (this.minLength && typeof this.value === 'string' && this.minLength > this.value.length) return false;
        if (this.maxLength && typeof this.value === 'string' && this.maxLength < this.value.length) return false;
        if (this.regex)
            if (typeof this.value !== 'string')
                throw new TypeError(
                    `InputField ${this.id} has a RegExp validator
                     and a value of type ${typeof this.value}. Expected type "string".`
                );
            else if (this.value.match(this.regex) === null) return false;
        if (this.required && this.type === InputType.Checkbox) return this.checked ? true : false;
        if (this.type === InputType.Radio)
            throw new Error(`Cannot validate input with id ${this.id} on it's own. Radio inputs are validated as group inside of the FormData class instance.`)
        return true;
    }

    setValueAndValidate(value: InputValue) {
        this.value = value;
        this.valid = this.isValid();
    }

    toggleChecked() {
        this.checked = !this.checked;
        if (this.type !== InputType.Radio) this.valid = this.isValid();
    }
}