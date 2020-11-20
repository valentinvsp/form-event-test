export interface BaseFieldAttributes {
    id: string
    value?: string | number
}

export class BaseField implements BaseFieldAttributes {
    id: string;
    value?: string | number;
    touched: boolean;
    valid: boolean;
    constructor( attributesObj: BaseFieldAttributes ) {
        ({ id: this.id, value: this.value } = attributesObj);

        this.touched = false;
        this.valid = true; // TODO determine validity using the this.isValid() function (to be created)
    }
}