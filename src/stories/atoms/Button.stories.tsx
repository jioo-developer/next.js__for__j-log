import React from "react";
import { Button } from "./Button";

export default {
    title : 'atoms | Button',
    component : Button
}

export const button = () => {
    return <Button theme="success">버튼</Button>
}

button.story = {
    name : 'Default'
}