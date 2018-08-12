function getDaysInMonth(month, year, array) {
    array.length = 0;
    var date = new Date(year, month, 1);
    
    while (date.getMonth() === month) {
        array.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }
}

//-------------------------------------------------------------------

function addDays(daysArray, elementId) {
    var daysNode = document.getElementById(elementId);
    
    for(const current of daysArray) {
        var optionNode = document.createElement('option');
        optionNode.id = current;
        optionNode.value = current;
        optionNode.innerHTML = current;
        daysNode.appendChild(optionNode);
    }
    
}

//-------------------------------------------------------------------

function addDateNodes(dateArray, elementId, changer = false, message = ``, monthsNames = false) {
    var dateNode = document.getElementById(elementId);
    
    //Creating Initial Option
    createInitialOption(elementId);
    
    if (changer === false) {
        for (const current of dateArray) {
            var optionNode = document.createElement('option');
            optionNode.id = current;
            optionNode.value = current;
            monthsNames === false? optionNode.innerHTML = current: optionNode.innerHTML = monthsNames[current];
            dateNode.appendChild(optionNode);
        }
    } else if (changer === true) {
        var optionNode = document.createElement('option');
        optionNode.id = 'blankOption';
        optionNode.value = 'blankOption';
        optionNode.innerHTML = message;
        document.getElementById(elementId).appendChild(optionNode);
    }
}

function createInitialOption(elementId) {
    var optionNode = document.createElement('option');
    optionNode.id = 'blankOption';
    optionNode.value = 'blankOption';
    optionNode.innerHTML = '';
    document.getElementById(elementId).appendChild(optionNode);
}

//-------------------------------------------------------------------

function setCurrentDate(currentDate, specDay = false, dayElementId, monthElementId, yearElementId) {
    var currentDay;
    var currentMonth;
    var currentYear;
    if (specDay === false) {
        currentDay = currentDate.getDate();
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
    } else if (typeof specDay === 'object' && specDay.length === 3) {
        currentDay = specDay[0];
        currentMonth = specDay[1];
        currentYear = specDay[2];
    }
    
    document.getElementById(monthElementId).value = currentMonth;
    document.getElementById(dayElementId).value = currentDay;
    document.getElementById(yearElementId).value = currentYear;
}

//-------------------------------------------------------------------

function changer(daysArray, dayElementId, monthElementId, yearElementId) {
    //Retreiving Current Day Value
    var oldDayValue = parseInt(document.getElementById(dayElementId).value);
    
    var currentMonth = parseInt(document.getElementById(monthElementId).value);
    var currentYear = parseInt(document.getElementById(yearElementId).value);

    getDaysInMonth(currentMonth, currentYear, daysArray);

    document.getElementById(dayElementId).innerHTML = [];

    addDays(daysArray);
    
    //Leaving Current Day Value
    document.getElementById(dayElementId).value = oldDayValue;
}

//-------------------------------------------------------------------

function changeMonthDate(daysArray, dayElementId, monthElementId, yearElementId) {
    var clickCount = 0;
    var clicked = false;
    document.getElementById(monthElementId).onclick = function() {
        var oldValue;
        var newValue;
        
        if (clickCount === 0) {
            clickCount = 1;
            oldValue = document.getElementById(monthElementId).value;
        } else if (clickCount === 1) {
            clickCount = 0;
            clicked = true;
            newValue = document.getElementById(monthElementId).value;
        }
        
        if (clicked === true) {
            if (oldValue !== newValue) {
                changer(daysArray);
                clicked = false;
            }
        }
        
    }
    
    document.getElementById(yearElementId).onkeyup = function() {
        var yearString = document.getElementById(yearElementId).value
        
        if (yearString.length === 4) {
            changer(daysArray, dayElementId, monthElementId, yearElementId);
        }
    }
}

//-------------------------------------------------------------------

var setDate = (dayElementId, monthElementId, yearElementId, specDay = false) => {
    var currentDate = new Date();
    var daysArray = [];
    var monthsArray = [];
    var yearsArray = [];
    
    if (specDay === false) {
        //Initial
        getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear(), daysArray);
        addDays(daysArray, dayElementId);
        //Setting Current Date
        setCurrentDate(currentDate, specDay, dayElementId, monthElementId, yearElementId);
    } else if (typeof specDay === 'object' && specDay.length === 3) {
        //Initial
        getDaysInMonth(specDay[1], specDay[2], daysArray);
        addDays(daysArray, dayElementId);
        //Setting Current Date
        setCurrentDate(currentDate, specDay, dayElementId, monthElementId, yearElementId);
    }
    
    //Change
    changeMonthDate(daysArray, dayElementId, monthElementId, yearElementId); 
    
};

//Arrays For Storing All Dates
var yearArr = [];
var monthArr = [];
var dayArr = [];
var grabDates = (elementList, type = `def`, clean = false, yearIn = ``, monthIn = ``, dayIn = ``) => {
    if (clean === true) {
        if (type === 'year') {
            yearArr.length = 0;
        } else if (type === 'month') {
            monthArr.length = 0;
        } else if (type === 'day') {
            dayArr.length = 0;
        }
    }
    for (current of elementList) {
        var year = parseInt(current[0].created.getFullYear());
        var month = parseInt(current[0].created.getMonth());
        var day = parseInt(current[0].created.getDate());
        if (type === 'year') {
            if (!yearArr.includes(year)) {
                yearArr.push(year);
            }
        } else if (type === 'month') {
            if (typeof yearIn === 'number') {
                if (yearIn === year && !monthArr.includes(month)) {
                    monthArr.push(month);
                }
            }
        } else if (type === 'day') {
            if (typeof yearIn === 'number' && typeof monthIn === 'number') {
                if (yearIn === year && monthIn === month && !dayArr.includes(day)) {
                    dayArr.push(day);
                }
            }
        }
    }
    
    //Sorting Months & Days
    monthArr.sort((a,b) => {return a-b});
    dayArr.sort((a,b) => {return a-b});
}

var setGrabbedDates = (yearElementId, monthElementId, dayElementId) => {
    //Two Times Prevent
    var checker = false;
    var monthChecker = false;
    
    //Old Values
    var monthValue = 'noVal';
    var dayValue = 'noVal';
    
    addDateNodes(yearArr, yearElementId);
    
    //Setting Up Months & Days Initial Options
    if (document.getElementById(yearElementId).value === 'blankOption') {
        addDateNodes(undefined, monthElementId, true, 'Select Year First');
        addDateNodes(undefined, dayElementId, true, 'Select Year First');
    }
    
    var monthsIndex = [];
    var yearIndex;
    document.getElementById(yearElementId).onclick = () => {
        if (checker === false) {
            if (document.getElementById(yearElementId).value !== 'blankOption') {
                var year = parseInt(document.getElementById(yearElementId).value);
                document.getElementById(monthElementId).innerHTML = '';
                
                //Grabbing Months
                grabDates(leftElementList, 'month', true, year);
                grabDates(rightElementList, 'month', false, year);
                
                addDateNodes(monthArr, monthElementId, false,``, monthsNameArr);
                
                //Cleaning & Refreshing Days Options
                document.getElementById(dayElementId).innerHTML = '';
                addDateNodes(yearArr, dayElementId, true, 'Select Month First');
            } else {
                //Cleaning & Refreshing Days Options
                document.getElementById(monthElementId).innerHTML = '';
                addDateNodes(undefined, monthElementId, true, 'Select Year First');
            }
            
            checker = true;
        }
        checker = false;
    }

    document.getElementById(monthElementId).onclick = () => {
        if (monthChecker === false) {
            if (document.getElementById(monthElementId).value !== 'blankOption') {
                var year = parseInt(document.getElementById(yearElementId).value);
                var month = parseInt(document.getElementById(monthElementId).value);
                document.getElementById(dayElementId).innerHTML = '';
                
                //Grabbing Days
                grabDates(leftElementList, 'day', true, year, month);
                grabDates(rightElementList, 'day', false, year, month);
                
                addDateNodes(dayArr, dayElementId, false);
            } else {
                //Cleaning & Refreshing Days Options
                document.getElementById(dayElementId).innerHTML = '';
                addDateNodes(undefined, dayElementId, true, 'Select Month First');
            }
            
            monthChecker = true;
        }
        monthChecker = false;
    }
}