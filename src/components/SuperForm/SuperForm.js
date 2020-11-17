import React, { useState, useRef, useEffect } from 'react';
import './SuperForm.scss';

/*
TODO
1. Initialize form state on mount with info derived from input elements (DONE)
2. Pass refs of each input's next input element into it's state. (DONE)
3. Use the refs to add an event that send your focus to the next input element when pressing enter. (DONE)
4. Add an onBlur event to turn touched to true AND validate that element. 
5. Add a validation event for each keypress or click on an input. The validation should only trigger if touched is true.
6. Add form level validation for the handleSubmit function.
*/

// TODO add event listeners to the form (using event delegation) to alter state when necessary, validate on blur etc.

// use these attributes for validation
// console.log('valid: ', e.target[0].validity.valid);
// console.log('value missing: ', e.target[0].validity.valueMissing);

const ENTER = 13;

const SuperForm = () => {
    const [formData, setFormData] = useState({});
    const signupForm = useRef(null);
    const renderCount = useRef(0);

    const createStateObjFromForm = form => {
        let state = {};
        new Array(...form.elements).forEach((input, idx, arr) => {
            if (input.type === 'submit') return;
            const inputState = {
                index: idx,
                name: input.id,
                value: input.value,
                touched: false,
                error: input.dataset.error,
                nextInput: arr[idx + 1],
            };
            state = { ...state, [input.id]: inputState };
        });
        return state;
    };

    const handleKeyDown = e => {
        if (e.keyCode === ENTER) e.preventDefault();
    };

    const handleKeyUp = e => {
        e.preventDefault();
        if (e.keyCode === ENTER && e.target.id)
            return formData[e.target.id].nextInput.focus();
        if (e.target.type === 'submit') return handleSubmit();
        const formState = { ...formData };
        formState[e.target.id].value = e.target.value;
        setFormData(formState);
    };

    useEffect(() => {
        if (signupForm.current) {
            const state = createStateObjFromForm(signupForm.current);
            setFormData(state);
        }

        return () => {};
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        console.log('SUBMITTED');
    };

    renderCount.current++;
    console.log(`render number ${renderCount.current}`);
    // console.log('formData: ', formData);

    return (
        <form
            ref={signupForm}
            noValidate
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
        >
            <input
                id="user"
                type="text"
                data-error="Must have a user"
                validation-message="custom message here"
                required
            />
            <input
                id="email"
                type="email"
                data-error="Check if email is correct"
                required
            />
            <div className="wtf">wtf</div>
            <input
                id="pass"
                type="password"
                minLength={8}
                data-error="Password must be at least 8 characters long"
                required
            />
            <input
                id="pass-confirm"
                type="password"
                data-error="Passwords must match"
                minLength={8}
                required
            />
            <input type="submit" value="send" onClick={handleSubmit} />
        </form>
    );
};
export default SuperForm;
