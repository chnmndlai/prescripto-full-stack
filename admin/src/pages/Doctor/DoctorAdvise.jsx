import {useState} from 'react';

export default function  ControlledComponent()  {
    const  [inputValue, setInputValue] =  useState('');

    const  handleChange = (event) => {
        setInputValue(event.target.value);
    };

return  (
<form>
    <input type="text" value={inputValue} onChange={handleChange} placeholder="Гарчиг" />
    <br></br>
    <br></br>
    <input type="text" onChange={handleChange} size="50" placeholder="Зөвлөгөө" />
</form>
)};