export enum InputType {
    Text = 'text',
    Email = 'email',
    Password = 'password'
}

type InputValue = string | number;

export interface InputOptions {
    id?: number;
    name: string;
    type: InputType;
    value?: InputValue;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    touched?: boolean;
    valid?: boolean;
    regex?: RegExp;
    label?: string;
}

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
    regex?: RegExp;
    label?: string;

    constructor(options: InputOptions) {
        ({
            id: this.id,
            name: this.name,
            type: this.type,
            placeholder: this.placeholder,
            required: this.required,
            minLength: this.minLength,
            maxLength: this.maxLength,
            label: this.label
        } = options);

        this.touched = false;
        this.valid = this.isValid();
        const { value } = options;
        this.value = value ? value : '';
    }

    isValid() {
        let valid = true;
        if (this.required && !this.value) valid = false;
        return valid;
    }

    changeTo(value: InputValue, id?: number) {
        this.value = value;
        this.id = id ? id : 0;
    }

    blur() {
        this.touched = true;
    }
}

export class FormState {
    state: Input[];
    lastId: number = 1;

    constructor(input?: Input) {
        this.state = input ? [input] : [];
    }

    addInput(input: Input) {
        if (this.state.some(i => i.name === input.name)) {
            console.log(
                `Input with name ${input.name} already exists in the form!`
            ); //throw err?
            return;
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

    changeInput(name: string, value: string) {
        const input = this.state.find( i => i.name === name );
        if ( input ) {
            this.lastId++;
            input.changeTo(value, this.lastId);
            return input;
        } else {
            console.log(`Input with name ${name} does not exist in this FormState instance.`)
        }
    }
}
