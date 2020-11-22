import { BaseField, BaseFieldAttributes } from './BaseField';

export enum TextareaFieldType {
    Textarea = 'textarea'
}

export interface TextareaAttributes {
    type: TextareaFieldType;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
}

export type TextareaFieldAttributes = TextareaAttributes & BaseFieldAttributes;

export class TextareaField extends BaseField implements TextareaAttributes  {
    type: TextareaFieldType;
    constructor(attributes: TextareaFieldAttributes) {
        super(attributes);
        ({ type: this.type } = attributes);
    }
}