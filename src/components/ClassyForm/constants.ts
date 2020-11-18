import { Input, InputType } from './ClassyClasses';

export const inputData: Input[] = [
    new Input({
        name: 'username',
        type: InputType.Text,
        label: 'Enter Username:',
    }),
    new Input({
        name: 'email',
        type: InputType.Email,
        label: 'Enter Email:',
    }),
    new Input({
        name: 'password',
        type: InputType.Password,
        label: 'Enter Password:',
    }),
    new Input({
        name: 'submit button',
        type: InputType.Button,
        value: 'SUBMIT',
    }),
    new Input({
        name: 'hungry',
        type: InputType.Checkbox,
        value: 'hungry',
        checked: false,
        label: 'Are you hungry?'
    }),
    new Input({
        name: 'thirsty',
        type: InputType.Checkbox,
        value: 'thirsty',
        checked: false,
        label: 'Are you thirsty?'
    }),
];
