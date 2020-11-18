export enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password',
    Button = 'button',
    Checkbox = 'checkbox',
}

export type InputValue = string | number;

export interface InputOptions {
    name: string;
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
    id?: number;
    name: string;
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

        this.touched = false;
        this.valid = this.isValid();
        const { value, validationError } = options;
        this.value = value ? value : '';
        this.validationError = validationError ? validationError : 'Field is not valid.';

        if (
            this.type === InputType.Checkbox &&
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
                    `Input ${this.name} is assigned a RegExp validator,
                    but is not of an allowed type. Allowed types are "text", "email" and "password"`
                );
    }

    isValid() {
        if (this.required && !this.value) return false;
        if (this.regex)
            if (typeof this.value !== 'string')
                throw new TypeError(
                    `Input ${this.name} has a RegExp validator
                     and a value of type ${typeof this.value}. Expected type "string".`
                );
            else if (this.value.match(this.regex) === null) return false;
        return true;
    }

    setId(id: number) {
        this.id = id;
    }

    setValue(value: InputValue) {
        this.value = value;
        this.valid = this.isValid();
    }

    toggleChecked() {
        this.checked = !this.checked;
    }

    blur() {
        this.touched = true;
    }
}
export class FormState {
    state: Input[];
    lastId: number = 0;

    constructor(input?: Input | Input[]) {
        if (input instanceof Input) {
            this.lastId++;
            input.setId(this.lastId);
            this.state = [input];
        } else if (input instanceof Array) {
            input.forEach((i, idx) => i.setId(idx + 1));
            this.lastId = input.length;
            this.state = input;
        } else this.state = [];
    }

    addInput(input: Input) {
        if (this.state.some(i => i.name === input.name)) {
            throw new TypeError(
                `Input with name ${input.name} already exists in the form!`
            );
        }
        this.lastId++;
        input.id = this.lastId;
        this.state.push(input);
    }

    removeInput(name: string) {
        let inputToRemove: string = '';
        this.state.filter(input => {
            if (input.name !== name) return true;
            inputToRemove = input.name;
            return false;
        });
        return inputToRemove ? inputToRemove : null;
    }

    getState() {
        return [...this.state];
    }

    setInputValue(name: string, value: InputValue) {
        const input = this.state.find(i => i.name === name);
        if (input) {
            input.setValue(value);
            return input;
        } else {
            throw new Error(
                `Input with name ${name} does not exist in this FormState instance.`
            );
        }
    }

    toggleInputChecked(name: string) {
        const input = this.state.find(i => i.name === name);
        if (!input)
            throw new Error(
                `Input with name ${name} does not exist in this FormState instance.`
            );
        if (input.type !== InputType.Checkbox)
            throw new Error(
                `Input with name ${name} does not have type "checkbox".`
            );
        input.toggleChecked();
        return input;
    }

    touchInput(name: string) {
        const input = this.state.find(i => i.name === name);
        if (!input)
            throw new Error(
                `Input with name ${name} does not exist in this FormState instance.`
            );
        input.blur();
    }
}
