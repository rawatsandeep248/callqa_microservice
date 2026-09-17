const datetime = require('node-datetime');
const moment = require('moment');

class DateUtil {
    constructor() {
    }

    static getCurrentDate() {
        return new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    };

    static getUtcDateTimeString(datetime) {
        if(datetime) return moment(new Date(datetime)).utc().format("YYYY-MM-DD HH:mm:ss");
        return moment(new Date()).utc().format("YYYY-MM-DD HH:mm:ss");
    }

    static convertTimeToSeconds(hour, minute) {
        return (hour*3600) + (minute*60);
    } 
    
    static getTimeStringFromTimezone(date, timezone) {
        if(date && timezone){
            if(datetime) return moment.tz(new Date(date), timezone).format("YYYY-MM-DD HH:mm:ss")
            return moment.tz(new Date(), timezone).format("YYYY-MM-DD HH:mm:ss")
        }else{
            return moment.tz(new Date(), 'utc').format("YYYY-MM-DD HH:mm:ss")
        }
    }

    static getCurrentMilliseconds() {
        const dt = datetime.create();
        return dt.now();
    };

    static compareTime(startTime, endTime, startDate, endDate) {
        let startHour = startTime.hour;
        let startMinute = startTime.minute;
        let startSecond = startTime.seconds || 0;
       
        let endHour = endTime.hour;
        let endMinute = endTime.minute;
        let endSecond = endTime.seconds || 0;
       
        //Create date object and set the time to that
        let startTimeObject = new Date(startDate);
        startTimeObject.setHours(startHour, startMinute, startSecond);
       
        //Create date object and set the time to that
        let endTimeObject = new Date(endDate);
        endTimeObject.setHours(endHour, endMinute, endSecond);
       
        if(startTimeObject > endTimeObject) return -1;
        else if(startTimeObject < endTimeObject) return 1;
        else return 0;
    }

    static compareDate(firstDate, secondDate, timezone) {
        let ft = moment.tz(new Date(firstDate), timezone).format("YYYY-MM-DD hh:mm:ss");
        let st = moment.tz(new Date(secondDate), timezone).format("YYYY-MM-DD hh:mm:ss");
        firstDate = ft.split(" ")[0];
        secondDate = st.split(" ")[0];
        if(firstDate === secondDate) return 1;
        else return -1;
    }

    static getCurrentDateString() {
        let currentDate = new Date();
        let date = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        let dateString = year + "-" + month + "-" + date;
        return dateString;
    };

    static getCurrentDateInMySQLFormat() {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();
        let date = year + '-' + month + '-' + day;
        return date;
    };

    static getCurrentMonth() {
        let today = new Date();
        let month = today.getMonth() + 1;
        return month
    }

    static getCurrentFY() {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        if (month >= 1 && month <= 3) {
            return (year - 1) + "-" + year;
        }
        return year + "-" + (year + 1);
    }

    static getUtcDate(){
        let date = new Date();
        return `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`
    }

    static getTime(){
        return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    static convertSecondsToHms(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        console.log("houres", hours, minutes, remainingSeconds)
        let qformattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        const qformattedTotalDuration = qformattedDuration==='NaN:NaN:NaN'?"00:00:00":qformattedDuration
        return qformattedTotalDuration 
    }

    static secondsToHms(sec) {
        let secToNumber = Number(sec);
        let h = Math.floor(secToNumber / 3600);
        let m = Math.floor(secToNumber % 3600 / 60);
        let s = Math.floor(secToNumber % 3600 % 60);
        return { h: h, m: m, s: s};
    }
}

module.exports = DateUtil;