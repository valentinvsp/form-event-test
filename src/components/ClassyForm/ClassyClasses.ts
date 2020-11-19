export enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password',
    Button = 'button',
    Checkbox = 'checkbox',
    Radio = 'radio'
}

export type InputValue = string | number;

export interface InputOptions {
    id: string;
    name?: string;
    type: InputType;
    value?: InputValue;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    touched?: boolean;
    valid?: boolean;
    validationError?: string;
    regex?: RegExp;
    label?: string;
    checked?: boolean;
}

export type InputValidation = [number, string, boolean, string];

export class Input implements InputOptions {
    id: string;
    name?: string;
    type: InputType;
    value: InputValue;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    touched: boolean;
    valid: boolean;
    validationError?: string;
    regex?: RegExp;
    label?: string;
    checked?: boolean;

    constructor(options: InputOptions) {
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
        } = options);

        const { value, validationError } = options;
        this.value = value ? value : '';
        this.validationError = validationError ? validationError : 'Field is not valid.';

        this.touched = false;
        this.valid = this.isValid();

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
                    `Input ${this.id} is assigned a RegExp validator,
                    but is not of an allowed type. Allowed types are "text", "email" and "password".`
                );
        if (this.type === InputType.Radio && typeof this.name === 'undefined') throw new Error(
            `Input ${this.id} is of type "radio", but is not assigned a "name" property.
            Radio buttons need a "name" property to work properly.`
        );
    }

    // TODO -> Handle validit checks for checkboxes (if required) and radios (if none is selected and one should be)
    isValid() {
        if (this.required && !this.value) return false;
        if (this.regex)
            if (typeof this.value !== 'string')
                throw new TypeError(
                    `Input ${this.id} has a RegExp validator
                     and a value of type ${typeof this.value}. Expected type "string".`
                );
            else if (this.value.match(this.regex) === null) return false;
        if (this.required && this.type === InputType.Checkbox) return this.checked ? true : false;
        return true;
    }

    setValueAndValidate(value: InputValue) {
        this.value = value;
        this.valid = this.isValid();
    }

    toggleChecked() {
        this.checked = !this.checked;
        this.valid = this.isValid();
    }

    blur() {
        this.touched = true;
    }
}
export class FormState {
    state: Input[] = [];

    constructor(input?: Input | Input[] | InputOptions[]) {
        if (typeof input === 'undefined') return;
        if (input instanceof Array && input.length === 0) return;
        if (input instanceof Input) {
            this.addInput(input);
            return;
        }
        if (input instanceof Array && input.length > 0) {
            input.forEach( el => {
                if (el instanceof Input) {
                    this.addInput(el);
                }
                else {
                    this.addInput(new Input(el));
                }
            })
            return;
        }
        throw new TypeError(`FormState constructor takes one argument, which can be
         of type Input, Input[], InputOptions[], or an Array containing a mix of Input and InputOptions.
         Received argument: ${input}`);
    }

    addInput(input: Input) {
        if (!(input instanceof Input)) throw new TypeError(`${input} must be an instance of Input.`)
        if (this.state.some(i => i.id === input.id)) {
            throw new TypeError(
                `Input with id ${input.id} already exists in the form! Ids must be unique strings.`
            );
        }
        if (input.type === InputType.Radio) {
            if (input.checked) 
                this.state.filter( i => i.name === input.name)
                .forEach( i => { if (i.checked) i.toggleChecked() })
        }
        this.state.push(input);
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

    setInputValue(id: string, value: InputValue) {
        const input = this.state.find(i => i.id === id);
        if (input) {
            input.setValueAndValidate(value);
            return input;
        } else {
            throw new Error(
                `Input with id ${id} does not exist in this FormState instance.`
            );
        }
    }

    toggleInputChecked(id: string) {
        const input = this.state.find(i => i.id === id);
        if (!input)
            throw new Error(
                `Input with id ${id} does not exist in this FormState instance.`
            );
        if (input.type !== InputType.Checkbox && input.type !== InputType.Radio)
            throw new Error(
                `To be able to toggle checked, input with id ${id} must be of type "checkbox" or "radio".`
            );
        input.toggleChecked();
        return input;
    }

    touchInput(id: string) {
        const input = this.getInputIfValid(id);
        input.blur();
    }

    selectRadioInput(id: string) {
        const input = this.getInputIfValid(id);
        if (input.type !== InputType.Radio)
            throw new TypeError(`selectRadioInput only takes an Input of type "radio", received "${input.type}".`);
        const siblingRadios = this.state.filter( i => i.name === input.name && i.id !== input.id);
        if (input.checked === true ) return
        else {
            input.toggleChecked();
            siblingRadios.find( i => i.checked === true )?.toggleChecked();
        }
    }

    getInputIfValid(id: string) {
        const input = this.state.find(i => i.id === id);
        if (!input)
            throw new Error(
                `Input with id "${id}" does not exist in this FormState instance's state.`
            );
        return input;
    }
}
