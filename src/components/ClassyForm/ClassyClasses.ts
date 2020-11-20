import { BaseField, BaseFieldAttributes } from './BaseField'

export enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password',
    Button = 'button',
    Checkbox = 'checkbox',
    Radio = 'radio',
}

export enum SelectType {
    SelectOne = 'select-one'
}

export type FieldType = InputType | SelectType;

export type InputValue = string | number;

export type InputAttributes = {
    type: InputType;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
    regex?: RegExp;
    checked?: boolean;
}

export interface SelectAttributes {
    type: SelectType;
    options: string[];
}

export type FieldAttributes = (InputAttributes | SelectAttributes) & BaseFieldAttributes;

export type InputFieldAttributes = InputAttributes & BaseFieldAttributes;
export type SelectFieldAttributes = SelectAttributes & BaseFieldAttributes;

export type Field = InputField | SelectField;

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

export class SelectField extends BaseField implements SelectAttributes  {
    type: SelectType;
    options: string[];
    constructor(attributes: SelectAttributes & BaseFieldAttributes) {
        super(attributes);
        ({ type: this.type,  options: this.options } = attributes);

        if (this.options.length < 1) throw new Error(`SelectField attributes containing id ${this.id} has no options.
            It must have at least 1 option!`);
        this.value = this.options[0];
    }
}
export class FormState {
    state: (Field)[] = [];

    constructor(fields?: FieldAttributes[]) {
        if (typeof fields === 'undefined') return;
        if (fields instanceof Array && fields.length === 0) return;
        if (fields instanceof Array && fields.length > 0) {
            fields.forEach( field => {
                // WARNING! The below statement contains a "hacky workawround" using "as".
                // TODO -> find a better solution
                if (Object.values(InputType).includes(field.type as InputType)) { 
                    this.addField(new InputField(field as InputFieldAttributes));
                }
                if (Object.values(SelectType).includes(field.type as SelectType)) { 
                    this.addField(new SelectField(field as SelectFieldAttributes));
                }
            })
            return;
        }
        throw new TypeError(`FormState constructor takes one argument, which can be
         of type InputField, InputField[], InputOptions[], or an Array containing a mix of InputField and InputOptions.
         Received argument: ${fields}`);
    }

    addField( field: Field) {
        if (this.state.some(f => f.id === field.id)) {
            throw new TypeError(
                `Field with id ${field.id} already exists in the form! Ids must be unique strings.`
            );
        }
        if (field.type === InputType.Radio && field.checked) {
            const radioSiblings = this.state.filter( f => f.name === field.name) as InputField[];
            radioSiblings.forEach( f => { if (f.checked) f.toggleChecked() })
        }
        this.state.push(field);
    }

    removeInputById(id: string) {
        let inputToRemove: string = '';
        this.state.filter(input => {
            if (input.id !== id) return true;
            inputToRemove = input.id;
            return false;
        });
        return inputToRemove ? inputToRemove : null;
    }

    getState() {
        return [...this.state];
    }

    setFieldValue(id: string, value: InputValue) {
        const field = this.state.find(f => f.id === id);
        if (!field) throw new Error(`InputField with id ${id} does not exist in this FormState instance.`);
        if (field instanceof InputField) {
            field.setValueAndValidate(value);
            return field;
        } else if (field instanceof SelectField) {
            if (typeof value !== 'string') throw new TypeError(`SelectField update value must be of type "string", found ${typeof value}`);
            field.setValue(value);
        } else {
            throw new Error(`Field with id ${id} is not an instance of InputField.`);
        }
    }

    toggleInputChecked(id: string) {
        const input = this.state.find(i => i.id === id);
        if (!input)
            throw new Error(
                `InputField with id ${id} does not exist in this FormState instance.`
            );
        if (input.type !== InputType.Checkbox && input.type !== InputType.Radio)
            throw new Error(
                `To be able to toggle checked, input with id ${id} must be of type "checkbox" or "radio".`
            );
        input.toggleChecked();
        return input;
    }

    touchInput(id: string) {
        const input = this.getInputById(id);
        input.blur();
    }

    selectRadioInput(id: string) {
        const input = this.getInputById(id);
        if (input.type !== InputType.Radio)
            throw new TypeError(`selectRadioInput only takes an InputField of type "radio", received "${input.type}".`);
        const siblingRadios = this.state.filter( i => i.name === input.name && i.id !== input.id) as InputField[];
        if (input.checked === true ) return
        else {
            input.toggleChecked();
            siblingRadios.find( i => i.checked === true )?.toggleChecked();
        }
    }

    getInputById(id: string) {
        const input = this.state.find(i => i.id === id);
        if (!input)
            throw new Error(
                `InputField with id "${id}" does not exist in this FormState instance's state.`
            );
        if (!(input instanceof InputField)) throw new Error(`Field with id ${id} is not an instance of InputField.`)
        return input;
    }

    isValid() {
        const valid =  !this.state.some( input => input.type !== InputType.Radio && !input.isValid());
        this.validateRadios();
        if (valid) return true
        else {
            this.state.forEach( input => input.blur());
            return false;
        }
    }

    validateRadios() {
        const radios = this.state.filter(i => i.type === InputType.Radio);
        let valid = true;
        radios.forEach( i => {
            if (i.type !== InputType.Radio) throw new Error(`InputField with id ${i.id} is not of type "radio", and cannot be used in the validateRadios function.`);
            if (i.required === true) {
                const siblings = radios.filter( r => r.name === i.name) as InputField[];
                valid = siblings.some( r => r.checked === true);
                siblings.forEach( r => r.valid = valid);    
            }
        });
        return valid;
    }
}