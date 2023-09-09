import { LightningElement, api } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets';

export default class AlarmClockApp extends LightningElement {
    clockImage = AlarmClockAssets + '/AlarmClockAssets/clock.png';
    alarmTune = new Audio(AlarmClockAssets + '/AlarmClockAssets/Clocksound.mp3');
    currentTime;
    hours = [];
    minutes = [];
    meridiems = ['AM','PM'];
    hoursSelected = '';
    minutesSelected = '';
    meridiemSelected = '';
    alarmTime = '';
    isAlarmActive = false;
    isAlarmTriggered = false;

    connectedCallback(){
        this.getHoursOptions();
        this.getMinutesOptions();
        this.getCurrentTime();
    }

    get isSetAlarmDisabled(){
        return !(this.hoursSelected && this.minutesSelected && this.meridiemSelected)
    }

    getCurrentTime(){
        setInterval(() => {
            let dateTime = new Date();
            let hours = dateTime.getHours();
            let mins = dateTime.getMinutes();
            let secs = dateTime.getSeconds();
            let ampm = 'AM';

            if(hours == 0){
                hours = 12;
            }
            else if(hours >= 12){
                hours = hours - 12;
                ampm = 'PM';
            }

            hours = hours < 10 ? '0'+hours : hours;
            mins = mins < 10 ? '0'+mins : mins;
            secs = secs < 10 ? '0'+secs : secs;

            this.currentTime = `${hours}:${mins}:${secs} ${ampm}`;

            if(this.alarmTime === `${hours}:${mins} ${ampm}`){
                this.isAlarmTriggered = true;
                this.alarmTune.play();
                this.alarmTune.loop = true;
            }
        },1000);
    }

    getHoursOptions(){
        for(let i = 1; i<=12; i++){
            let val = i<10 ? '0'+i : i;
            this.hours.push(val);
        }
    }

    getMinutesOptions(){
        for(let i = 0; i < 60; i++){
            let val = i < 10 ? "0"+i : i+"";
            this.minutes.push(val);
        }
    }

    optionChangeEventHandler(event){
        let {label, value} = event.detail;
        if(label === 'Hours'){
            this.hoursSelected = value;
        }
        else if(label === 'Minutes'){
            this.minutesSelected = value;
        }
        else if(label === 'Meridiems'){
            this.meridiemSelected = value;
        }
    }

    get shakeImage(){
        return this.isAlarmTriggered ? 'shake' : '';
    }

    setAlarmTime(){
        this.alarmTime = `${this.hoursSelected}:${this.minutesSelected} ${this.meridiemSelected}`;
        this.isAlarmActive = true;
    }

    clearAlarmTime(){
        this.alarmTime = '';
        this.alarmTune.pause();
        this.isAlarmTriggered = false;
        this.isAlarmActive = false;
        const childElements = this.template.querySelectorAll('c-alarm-clock-inputs');
        Array.from(childElements).forEach(element => {
            element.reset('');
        });
    }
}