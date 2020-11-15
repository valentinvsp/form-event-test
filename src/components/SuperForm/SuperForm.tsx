import React, { useState, useRef, useEffect } from 'react';
import './SuperForm.scss';

/*
TODO
1. Initialize form state on mount with info derived from input elements
2. Pass refs into the state?
3. Use the refs to add eveents that send your focus to the next input element when pressing enter?
OR catch the event on the form element and use the array to focus the next target in its array?
4. 
*/

const SuperForm = () => {
    const [formData, setFormData] = useState({})
    const formRef = useRef<HTMLFormElement>(null);
    
    // use the form ref to cycle through form elements and initialize state
    // and add event listeners to the form (using event delegation) to alter state when necessary, validate on blur etc.
    useEffect(() => {
        if (formRef.current) console.log(formRef.current.elements);
        return () => {
            
        }
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('SUBMITED')

        // use these event attributes to create initial state when cycling through elements at mount
        // OR use the form ref to do it
        console.log(e.target[0].id); 
        console.log(e.target[0].validationMessage);

        // use these attributes for validation 
        console.log('valid: ', e.target[0].validity.valid); 
        console.log('value missing: ', e.target[0].validity.valueMissing);

        e.target[0].addEventListener('click', () => console.log('clicked'));  // this method of adding event listeners works.
        // use this on mount to cycle through inputs and add "kepress enter" and "blur" event listeners


        // console.log(e.target[0].);
        // e.target.target[0].setCustomValidity('i am the custom message');
        // e.target.elements.user.validationMessage = 'maybe this works';
        
        console.log(e);
    }
    

    return (
        <form ref={formRef} action="" noValidate onSubmit={handleSubmit}>
            <input id="user" type="text" data-error="Must have a user" validation-message="custom message here" required/>
            <input id="email" type="email" data-error="Check if email is correct" required/>
            <div className="wtf">wtf</div>
            <input id="pass" type="password" minLength={8} data-error="Password must be at least 8 characters long" required/>
            <input id="pass-confirm" type="password" data-error="Passwords must match" minLength={8} required/>
            <input type="submit" value="send" />
        </form>
    )
}
export default SuperForm;
