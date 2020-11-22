import { BaseFieldAttributes } from './BaseField';
import { SelectField, SelectFieldAttributes, SelectAttributes, SelectType } from './SelectFields';
import { InputField, InputFieldAttributes, InputAttributes, InputValue, InputType } from './InputFields'

export type FieldType = InputType | SelectType;

export type FieldAttributes = (InputAttributes | SelectAttributes) & BaseFieldAttributes;

export type Field = InputField | SelectField;

export type FormState = {
    fieldsArray: Field[];
    fieldsObject: {
        [fieldName: string]: Field
    };
}
export interface FormData {
    fieldsArray: Field[];
    fieldsObject: {};
}
export class FormData {

    constructor(fields?: FieldAttributes[]) {
        this.fieldsArray = [];
        this.fieldsObject = {};

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
        throw new TypeError(`FormData constructor takes one argument, which can be
         of type InputField, InputField[], InputOptions[], or an Array containing a mix of InputField and InputOptions.
         Received argument: ${fields}`);
    }

    addField( field: Field) {
        if (this.fieldsArray.some(f => f.id === field.id)) {
            throw new TypeError(
                `Field with id ${field.id} already exists in the form! Ids must be unique strings.`
            );
        }
        if (field.type === InputType.Radio && field.checked) {
            const radioSiblings = this.fieldsArray.filter( f => f.name === field.name) as InputField[];
            radioSiblings.forEach( f => { if (f.checked) f.toggleChecked() })
        }
        this.fieldsArray.push(field);
        this.fieldsObject = {...this.fieldsObject, [field.id]: field };
    }

    removeInputById(id: string) {
        let inputToRemove: string = '';
        this.fieldsArray.filter(input => {
            if (input.id !== id) return true;
            inputToRemove = input.id;
            return false;
        });
        return inputToRemove ? inputToRemove : null;
    }

    getState(): FormState {
        return { fieldsArray: this.fieldsArray, fieldsObject: this.fieldsObject };
    }

    setFieldValue(id: string, value: InputValue) {
        const field = this.fieldsArray.find(f => f.id === id);
        if (!field) throw new Error(`InputField with id ${id} does not exist in this FormData instance.`);
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
        const input = this.fieldsArray.find(i => i.id === id);
        if (!input)
            throw new Error(
                `InputField with id ${id} does not exist in this FormData instance.`
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
        const siblingRadios = this.fieldsArray.filter( i => i.name === input.name && i.id !== input.id) as InputField[];
        if (input.checked === true ) return
        else {
            input.toggleChecked();
            siblingRadios.find( i => i.checked === true )?.toggleChecked();
        }
    }

    getInputById(id: string) {
        const input = this.fieldsArray.find(i => i.id === id);
        if (!input)
            throw new Error(
                `InputField with id "${id}" does not exist in this FormData instance's fieldsArray.`
            );
        if (!(input instanceof InputField)) throw new Error(`Field with id ${id} is not an instance of InputField.`)
        return input;
    }

    isValid() {
        const valid =  !this.fieldsArray.some( input => input.type !== InputType.Radio && !input.isValid());
        this.validateRadios();
        if (valid) return true
        else {
            this.fieldsArray.forEach( input => input.blur());
            return false;
        }
    }

    validateRadios() {
        const radios = this.fieldsArray.filter(i => i.type === InputType.Radio);
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