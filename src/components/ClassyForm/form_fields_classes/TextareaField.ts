import { BaseField, BaseFieldAttributes } from './BaseField';

export enum TextareaFieldType {
    SelectOne = 'select-one'
}

export interface TextareaAttributes {
    type: TextareaFieldType;
}

export type SelectFieldAttributes = TextareaAttributes & BaseFieldAttributes;

export class TextField extends BaseField implements TextareaAttributes  {
    type: TextareaFieldType;
    constructor(attributes: TextareaAttributes & BaseFieldAttributes) {
        super(attributes);
        ({ type: this.type } = attributes);
    }
}