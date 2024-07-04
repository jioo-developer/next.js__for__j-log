import React from "react";
import { Button } from "./Button";

export default {
    title : 'atoms | Button',
    component : Button
}

export const button = () => {
    return <Button theme="white" width="200" size="small">버튼</Button>
}

button.story = {
    name :'default'
}

export const successbutton = () => {
    return <Button theme="success" width="200" size="small">버튼</Button>
}

successbutton.story = {
    name : 'success'
}

