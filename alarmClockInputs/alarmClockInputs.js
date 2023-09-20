import { LightningElement, api } from 'lwc';

export default class AlarmClockInputs extends LightningElement {
    @api label;
    @api options;
    @api uniqueId;

    optionSelectHandler(event){
        this.createEventForParent(event.target.value);
    }

    createEventForParent(value){
        this.dispatchEvent(new CustomEvent('optionchange', {
            detail: {
                label: this.label,
                value: value
            }
        }))
    }

    @api reset(value){
        this.template.querySelector('select').value = value;
        this.createEventForParent(value);
    }
}