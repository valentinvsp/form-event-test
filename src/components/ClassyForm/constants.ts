import { InputOptions, InputType } from './ClassyClasses';

export const inputData: InputOptions[] = [
    {
        id: 'username',
        name: 'username',
        type: InputType.Text,
        label: 'Enter Username:',
        required: true
    },
    {
        id: 'email',
        name: 'email',
        type: InputType.Email,
        label: 'Enter Email:',
        required: true
    },
    {
        id: 'password',
        name: 'password',
        type: InputType.Password,
        label: 'Enter Password:',
        required: true
    },
    {
        id: 'hungry',
        name: 'hungry',
        type: InputType.Checkbox,
        value: 'hungry',
        checked: false,
        label: 'Are you hungry?'
    },
    {
        id: 'thirsty',
        name: 'thirsty',
        type: InputType.Checkbox,
        value: 'thirsty',
        checked: false,
        label: 'Are you thirsty?',
        required: true,
    },
    {
        id: 'slowspeed',
        name: 'speed',
        type: InputType.Radio,
        value: 'slow',
        label: 'Slow',
        checked: true
    },
    {
        id: 'fastspeed',
        name: 'speed',
        type: InputType.Radio,
        value: 'faster',
        label: 'Faster',
        checked: true
    },
    {
        id: 'fasterspeed',
        name: 'speed',
        type: InputType.Radio,
        value: 'fastest',
        label: 'Fastest',
    },
    {
        id: 'submit',
        name: 'submit button',
        type: InputType.Button,
        value: 'SUBMIT',
    },
];