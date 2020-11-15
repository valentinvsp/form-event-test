import React from 'react';
import './SuperForm.scss';
const SuperForm = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(e);
    }

    return (
        <form action="" noValidate onSubmit={handleSubmit}>
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <input type="submit" value="send" />
        </form>
    )
}
export default SuperForm;
