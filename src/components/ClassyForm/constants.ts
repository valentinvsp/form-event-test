import { InputOptions, InputType } from './ClassyClasses';

export const inputData: InputOptions[] = [
    {
        name: 'username',
        type: InputType.Text,
        label: 'Enter Username:',
        required: true
    },
    {
        name: 'email',
        type: InputType.Email,
        label: 'Enter Email:',
        required: true
    },
    {
        name: 'password',
        type: InputType.Password,
        label: 'Enter Password:',
        required: true
    },
    {
        name: 'submit button',
        type: InputType.Button,
        value: 'SUBMIT',
    },
    {
        name: 'hungry',
        type: InputType.Checkbox,
        value: 'hungry',
        checked: false,
        label: 'Are you hungry?'
    },
    {
        name: 'thirsty',
        type: InputType.Checkbox,
        value: 'thirsty',
        checked: false,
        label: 'Are you thirsty?'
    },
];