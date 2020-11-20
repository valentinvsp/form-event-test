export interface BaseFieldAttributes {
    id: string
    name?: string
    value?: string | number
    required?: boolean
    label?: string
    validationError?: string
}

export class BaseField implements BaseFieldAttributes {
    id: string;
    name?: string;
    value?: string | number;
    touched: boolean;
    valid: boolean;
    required?: boolean;
    label?: string;
    validationError?: string;
    constructor( attributesObj: BaseFieldAttributes ) {
        ({
            id: this.id, value: this.value, required: this.required,
            name: this.name, label: this.label, validationError: this.validationError
        } = attributesObj);

        this.touched = false;
        this.valid = this.isValid();
    }

    isValid() {
        if (this.required && this.value) return true;
        return false;
    }

    blur() {
        this.touched = true;
    }
}