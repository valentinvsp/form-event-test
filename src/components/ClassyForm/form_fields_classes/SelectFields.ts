import { BaseField, BaseFieldAttributes } from './BaseField'

export enum SelectType {
    SelectOne = 'select-one'
}

export interface SelectAttributes {
    type: SelectType;
    options: string[];
}

export type SelectFieldAttributes = SelectAttributes & BaseFieldAttributes;

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