import { InputOptions, InputType } from './ClassyClasses';

export const formFieldsData: InputOptions[] = [
    {
        id: 'username',
        name: 'username',
        type: InputType.Text,
        label: 'Enter Username:',
        required: true,
        minLength: 3,
        maxLength: 10,
        validationError: 'Username must be at least 3 characters long and at maximum 10.'
    },
    {
        id: 'email',
        name: 'email',
        type: InputType.Email,
        label: 'Enter Email:',
        required: true,
        regex: /^[\w-.]+@([\w-]+\.)+[\w]{2,4}$/,
        validationError: 'Please enter a valid email format.'
    },
    {
        id: 'password',
        name: 'password',
        type: InputType.Password,
        label: 'Enter Password:',
        required: true,
        regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/,
        validationError: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character.'
        // above regexp should match a password containing at least
        // 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character
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
        // checked: true,
        validationError: 'click us!'
    },
    {
        id: 'fastspeed',
        name: 'speed',
        type: InputType.Radio,
        value: 'faster',
        label: 'Faster',
        // checked: true
    },
    {
        id: 'fasterspeed',
        name: 'speed',
        type: InputType.Radio,
        value: 'fastest',
        label: 'Fastest',
        required: true,
    },
    {
        id: 'submit',
        name: 'submit button',
        type: InputType.Button,
        value: 'SUBMIT',
    },
];