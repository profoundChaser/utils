/// <reference types="vite/client" />
interface Window {
    showSaveFilePicker: Function
}

interface Function {
    _call: Function
    _apply: Function
    _bind: Function
}