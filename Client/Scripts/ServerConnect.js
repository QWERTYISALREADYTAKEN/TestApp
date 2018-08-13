//Authorization token
var auth = 'noAuth';
//Recieving
var Object = {};
//--------------------Login Page_________________________

var connectServer = () => {
    
    var postObject = {
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value
    }
    var twoTimesPrevent = true;
    var req = new XMLHttpRequest();
    req.open('POST', "https://morning-reaches-27593.herokuapp.com/login");
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            var object = JSON.parse(this.responseText);
            if (this.status === 200 && twoTimesPrevent === true) {
                auth = this.getResponseHeader('x-auth');
                openLoginPage('userName', object);

                //Setting Up UI with Response object
                (() => {
                    
                    //Creating Date Filter Menu
                    switchDateMenu('dateTab', false);
                    
                    //Left part
                    // Clearing Nodes And An Array
                    leftElementList.length > 0? clearNodeArrays(leftElementList, "incomeList", 'income'): () => {};
                    var leftArray = object.data.income.map(e => e = e);
                    //Refreshing Values
                    incomeSum = 0;
                    leftElementList.length = 0;
                    incomeSum = setAvIncome(object, incomeSum);
                    for (var i = 1; i < leftArray.length; i++) {
                        incomeSum += leftArray[i].inputValue;
                        //Fixing Date In Array
                        leftArray[i].created = new Date(leftArray[i].created);
                        var elementArray = [];
                        elementArray.push(leftArray[i]);
                        //Adding Element Array To Element List
                        leftElementList.push(elementArray);
                    }
                    //Sorting Arrays
                    leftElementList.sort(sortArrayByDate('-created'));
                    //Grabbing Dates For Choosing Elements With Specific Dates
                    grabDates(leftElementList, 'year', true);

                    //Right Part
                    rightElementList.length > 0? clearNodeArrays(rightElementList, "expensesList", 'expenses'): ()=> {};
                    var rightArray = object.data.expenses.map(e => e = e);
                    //Refreshing Values
                    expensesSum = 0;
                    rightElementList.length = 0;
                    for (var i = 1; i < rightArray.length; i++) {
                        expensesSum += rightArray[i].inputValue;
                        //Fixing Date In Array
                        rightArray[i].created = new Date(rightArray[i].created);
                        var elementArray = [];
                        elementArray.push(rightArray[i]);
                        //Adding Element Array To Element List
                        rightElementList.push(elementArray);
                    }
                    rightElementList.sort(sortArrayByDate('-created'));
                    
                    //Grabbing Dates For Choosing Elements With Specific Dates
                    grabDates(rightElementList, 'year', false);
                    
                    //Refreshing Left Percentage Values
                    refreshValues(leftElementList, incomeSum);
                    //Refreshing Right Percentage Values
                    refreshValues(rightElementList, expensesSum);

                    //Refresh Left Element List
                    refreshElementList(leftElementList, incomeElementCreate, "incomeList");
                    //Refresh Right Element List
                    refreshElementList(rightElementList, expensesElementCreate, "expensesList");

                    //Refreshing Upper Part
                    //Creating Upper Part
                    upperPart(leftElementList, rightElementList, false);
                    
                    //Setting Grabbed Dates
                    setGrabbedDates('chooseYearInput', 'chooseMonthInput', 'chooseDayInput');
                    
                    //Setting Up Date Filter Listeners
                    filterByDate(leftElementList, rightElementList, 'chooseYearInput', 'chooseMonthInput', 'chooseDayInput');

                })();

                twoTimesPrevent = false;
            } else if (this.status !== 200 && twoTimesPrevent === true) {
                if (object.err === 'Incorrect Username') {
                    document.getElementById('userName').style.cssText = 'outline: solid 1px #cc0000; borderRadius: 2px; boxShadow: 0px 0px 3px #ff6347';
                } else if (object.err === 'Incorrect Password') {
                    document.getElementById('password').style.cssText = 'outline: solid 1px #cc0000; borderRadius: 2px; boxShadow: 0px 0px 3px #ff6347';
                } else {
                    document.getElementById('userName').style.cssText = 'outline: solid 1px #cc0000; borderRadius: 2px; boxShadow: 0px 0px 3px #ff6347';
                    document.getElementById('password').style.cssText = 'outline: solid 1px #cc0000; borderRadius: 2px; boxShadow: 0px 0px 3px #ff6347';
                }
                
                document.getElementById('userName').onclick = () => {
                    document.getElementById('userName').style.cssText = '';
                }
                document.getElementById('password').onclick = () => {
                    document.getElementById('password').style.cssText = '';
                }
                twoTimesPrevent = false;
            }
        }
    }
    req.send(JSON.stringify(postObject));
}

openLoginPage();

document.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.id === 'login') {
        openLoginPage(true);
    }
});

//_________________________Sending And Recieving Data__________________________________
//Sending
//This Element Objects will store data - income/expenses, desciption, value
var sendData = (data, url=`getData`) => {
    var req = new XMLHttpRequest();
    req.open('POST', `https://morning-reaches-27593.herokuapp.com/${url}`);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader('x-auth', auth);
    req.send(JSON.stringify(data));
}

var sendRemoveID = (id, type, url = `removeData`) => {
    var object = {id, type};
    var req = new XMLHttpRequest();
    req.open('POST', `https://morning-reaches-27593.herokuapp.com/${url}`);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader('x-auth', auth);
    req.send(JSON.stringify(object));
}

var sendUpdateData = (data, url = `updateUserData`) => {
    var req = new XMLHttpRequest();
    var twoTimesPrevent = false;
    req.open('POST', `https://morning-reaches-27593.herokuapp.com/${url}`);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader('x-auth', auth);
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            var res = JSON.parse(this.responseText);
            if (this.status === 200 && twoTimesPrevent === false) {
                responseTake('userDataContainer', 'userData', 'successDiv', 'CHANGES SAVED');

                //Buttons Part
                document.getElementById('saveButton').style.color = '#b0b0b0';
                document.getElementById('inputButtons').style.backgroundColor = '#358c5a';

                //Response Part
                document.getElementById('successDiv').childNodes[0].style.cssText = 'color: #358c5a; display: inline-block; width: 200px;';
            } else if (this.status !== 200 && twoTimesPrevent === false) {
                responseTake('userDataContainer','userData', 'errDiv', res.err.toUpperCase());

                //Buttons Part
                document.getElementById('saveButton').style.color = '#cc0000';
                document.getElementById('inputButtons').style.backgroundColor = '#454545';

                //Response Part
                document.getElementById('errDiv').childNodes[0].style.color = '#cc0000';
            }
            twoTimesPrevent = true;
        }
    }
    req.send(JSON.stringify(data));
}

var sendRegisterData = (data, url = `register`) => {
    var req = new XMLHttpRequest();
    var twoTimesPrevent = false;
    req.open('POST', `https://morning-reaches-27593.herokuapp.com/${url}`);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader('x-auth', auth);
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            var res = JSON.parse(this.responseText);
            if (this.status === 200 && twoTimesPrevent === false) {
                auth = this.getResponseHeader('x-auth');

                responseTake('userDataContainer', 'userData', 'successDiv', 'SUCCESSFULLY REGISTERED');
                //Buttons Part
                document.getElementById('saveButton').style.color = '#b0b0b0';
                document.getElementById('inputButtons').style.backgroundColor = '#358c5a';

                //Response Part
                document.getElementById('successDiv').childNodes[0].style.cssText = 'color: #358c5a; display: inline-block; width: 200px;';
                setTimeout(() => {
                    openLoginPage('userName', res);
                    document.getElementById('userData').style.display = 'none';
                }, 1000);
                //Setting Average Income
                incomeSum = setAvIncome(res, incomeSum);
            } else if (this.status !== 200 && twoTimesPrevent === false) {
                responseTake('userDataContainer', 'userData', 'errDiv', 'FILL IN ALL FORMS');

                //Buttons Part
                document.getElementById('saveButton').style.color = '#cc0000';
                document.getElementById('inputButtons').style.backgroundColor = '#454545';

                //Response Part
                document.getElementById('errDiv').childNodes[0].style.color = '#cc0000';
            }
            twoTimesPrevent = true;
        }
    }
    req.send(JSON.stringify(data));
}

var sendLogoutRequest = (url = `logout`) => {
    var req = new XMLHttpRequest();
    var twoTimesPrevent = false;
    req.open('POST', `https://morning-reaches-27593.herokuapp.com/${url}`);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader('x-auth', auth);
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200 && twoTimesPrevent === false) {
                auth = this.getResponseHeader('x-auth');
                document.getElementById('saveButton').style.color = '#02b080';
                document.getElementById('saveButton').style.textShadow = '0px 0px 2px white';
                document.getElementById('inputButtons').style.backgroundColor = '#358c5a';

                setTimeout(()=>{
                    switchDateMenu('dateTab', true);
                    openLoginPage(false);
                    document.getElementById('userData').style.display = 'none';

                    //Left part
                    // Clearing Nodes And An Array
                    clearNodeArrays(leftElementList, "incomeList", 'income');
                    //Refreshing Values
                    incomeSum = 0;
                    leftElementList.length = 0;

                    //Right Part
                    clearNodeArrays(rightElementList, "expensesList", 'expenses');
                    //Refreshing Values
                    expensesSum = 0;
                    rightElementList.length = 0;

                    //Refreshing Left Percentage Values
                    refreshValues(leftElementList, incomeSum);
                    //Refreshing Right Percentage Values
                    refreshValues(rightElementList, expensesSum);

                    //Refresh Left Element List
                    refreshElementList(leftElementList, incomeElementCreate, "incomeList");
                    //Refresh Right Element List
                    refreshElementList(rightElementList, expensesElementCreate, "expensesList");

                    //Refreshing Upper Part
                    //Creating Upper Part
                    upperPart(leftElementList, rightElementList, false);
                }, 500);

            } else if (this.status !== 200 && twoTimesPrevent === false) {
                document.getElementById('saveButton').style.color = '#963749';
                document.getElementById('saveButton').style.textShadow = '0px 0px 2px white';
                document.getElementById('inputButtons').style.backgroundColor = '#454545';
            }
            //document.getElementById('userData').style.display = 'none';
            twoTimesPrevent = true;
        }
    }
    req.send();
}

var sendforgotPassRequest = (url = `forgotPass`) => {
    var object = {};
    object.userName = document.getElementById('userName').value;
    var req = new XMLHttpRequest();
    var twoTimesPrevent = false;
    req.open('POST', `https://morning-reaches-27593.herokuapp.com/${url}`);
    req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    req.setRequestHeader('x-auth', auth);
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            var object = JSON.parse(this.responseText);
            if (this.status === 200 && twoTimesPrevent === false) {
            
            } else if (this.status !== 200 && twoTimesPrevent === false) {
                if (object.err === 'emptyObject') {
                    document.getElementById('userName').style.cssText = 'outline: solid 1px #cc0000; borderRadius: 2px; boxShadow: 0px 0px 3px #ff6347';
                }
            }
            twoTimesPrevent = true;
        }
    }
    req.send(JSON.stringify(object));
}