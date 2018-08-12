//div Ids
var saveElementIds = {
    userName: 'inputName',
    email: 'inputEmail',
    password: 'inputPassword',
    sex: 'sexInput',
    firstName: 'inputFirstName',
    lastName: 'inputLastName',
    birthDay: 'dayInput',
    birthMonth: 'monthInput',
    birthYear: 'yearInput',
    avIncome: 'inputIncome',
    avIncomeDescription: 'inputIncDescription',
    setAvIncome: 'setAvIncomeInput',
    mainDate: 'dateTime',
}
//Login ID
var loginId;

//Login Enter Key Checker
var loginChecker = true;
//UserPageCode
var userPageCreate = (type = `update`, userName  = ``, email = ``, firstName = ``, lastName = ``, age = ``, sex = ``, avIncome = ``, avIncomeDescription = ``, setAvIncome = ``)=>{
    var userPage;
    userPage = document.createElement('div');
    userPage.id = 'container';
    var html = `<div id='userDataContainer'><div class='inputClass'><label class="upperText" for='inputName'>USERNAME:</label><input class='textInput' type='text' id='inputName' value='${userName}'></div><div class='inputClass'><label class="upperText" for='inputEmail'>EMAIL:</label><input class='textInput' type='email' id='inputEmail' value='${email}'></div><div class='inputClass'><label class="upperText" for='inputPassword'>PASSWORD:</label><input class='textInput' type='password' id='inputPassword'></div><div class='inputClass' id='radios'><label class="upperText" for='sexInput'>SEX:</label><select class='textInput' name='sex' id='sexInput'><option id='maleOpt' value='Male'>MALE</option><option id='femaleOpt' value='Female'>FEMALE</option></select></div><div class='inputClass'><label class="upperText" for='inputFirstName'>FIRST NAME:</label><input class='textInput' type='text' id='inputFirstName' value='${firstName}'></div><div class='inputClass'><label class="upperText" for='inputLastName'>LAST NAME:</label><input class='textInput' type='text' id='inputLastName' value='${lastName}'></div><div class='inputClass'id="dateDropdown"><label class="upperText" for='dayInput'>BIRTH DATE:</label><select class='textInput' name='day' id='dayInput'></select><select name='month' class='textInput' id='monthInput'><option id='jan' value=0>January</option><option id='feb' value=1>February</option><option id='mar' value=2>March</option><option id='apr' value=3>April</option><option id='may' value=4>May</option><option id='jun' value=5>June</option><option id='jul' value=6>July</option><option id='aug' value=7>August</option><option id='sep' value=8>September</option><option id='oct' value=9>October</option><option id='nov' value=10>November</option><option id='dec' value=11>December</option></select><input type='number' id='yearInput'></div><div class='inputClass'><label class="upperText" for='inputIncome'>MONTHLY INCOME:</label><input class='textInput' type='number' id='inputIncome' value='${avIncome}'></div><div class='inputClass'><label class="upperText" for='inputIncDescription'>INCOME DESCRIPTION:</label><input class='textInput' type='text' id='inputIncDescription' value='${avIncomeDescription}'></div><div class='inputClass' id='radios2'><label class="upperText" for='setAvInput'>SET INCOME?</label><select class='textInput' name='setAvIncome' id='setAvIncomeInput'><option id='yesOpt' value=true>YES</option><option id='noOpt' value=false>NO</option></select></div><div id='inputButtons'><input type='button' value='SAVE' class='inputButton' id='saveButton'><input type='button' value='RESET' class='inputButton' id='resetButton'>`;
    var updatePart = `<input type='button' value='LOG OUT' class='inputButton' id='logoutButton'>`;
    var endPart = `<input type='button' value='CLOSE' class='inputButton' id='closeButton'></div></div>`;
    if (type === 'update') {
        html = html + updatePart + endPart;
    } else if (type === 'register') {
        html = html + endPart;
    }
    
    
        
    userPage.innerHTML = html;
    
    return userPage;
};

//Sorting ElementLists by created time
var sortArrayByDate = (property) => {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    
    return (a,b) => {
        var result;
        if (a[0] && b[0]) {
            result = (a[0][property] < b[0][property]) ? -1 : (a[0][property] > b[0][property]) ? 1 : 0;
        } else {
            result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        }
        return result * sortOrder;
    }
}

var saveUserData = (el, type = `update`) => {
    var object = {};
    object.userName = document.getElementById(el.userName).value;
    object.email = document.getElementById(el.email).value;
    object.password = document.getElementById(el.password).value;
    object.sex = document.getElementById(el.sex).value;
    object.firstName = document.getElementById(el.firstName).value;
    object.lastName = document.getElementById(el.lastName).value;
    object.birthDay = document.getElementById(el.birthDay).value;
    object.birthMonth = document.getElementById(el.birthMonth).value;
    object.birthYear = document.getElementById(el.birthYear).value;
    object.avIncome = document.getElementById(el.avIncome).value;
    object.avIncomeDescription = document.getElementById(el.avIncomeDescription).value;
    object.setAvIncome = document.getElementById(el.setAvIncome).value;
    
    //Sending Data
    if (type === 'update') {
        sendUpdateData(object);
    } else if (type === 'register') {
        sendRegisterData(object);
    }
}

var setAvIncome = (object, incomeSum) => {
    incomeSum = incomeSum + object.avIncome;
    if (object.avIncome && object.avIncomeDescription && object.setAvIncome === true) {
        var elementArray = [];
        var inputObject = new listElement('income', object.avIncomeDescription, object.avIncome, incomeSum);   
        elementArray.push(inputObject);
        //Adding Element Array To Element List
        leftElementList.push(elementArray);
    }
    return incomeSum;
}

var responseTake = (elementId, parentElId, nodeId, message = ``) => {
    var node = 'noNode';
    for (current of document.getElementById(elementId).children) {
        if (current.className === 'responseStatus') {
            document.getElementById(elementId).removeChild(current);
        }
    }
    
    var newNode = document.createElement('div');
    newNode.className = 'responseStatus';
    newNode.id = nodeId;
    newNode.innerHTML = `<p class='upperText'>${message}</p>`;
    document.getElementById(elementId).appendChild(newNode);
    
    moveDownShow(nodeId, 0, 45, 1, 10);
}

var switchDateMenu = (elementId, switcher = false) => {
    document.getElementById(elementId).innerHTML = ``;
    
    var innerCode = `<div class='inputClass'id="chooseDate"><div class='innerChooseDate'><label class="upperText" for='chooseMonthInput'>YEAR</label><select name='year' class='textInput' id='chooseYearInput'></select></div><div class='innerChooseDate'><label class="upperText" for='chooseMonthInput'>MONTH</label><select name='month' class='textInput' id='chooseMonthInput'></select><label class="upperText" for='chooseDayInput'>DAY</label><select class='textInput' name='day' id='chooseDayInput'></select></div><div class='innerChooseDate'></div></div>`;
    
    if (switcher === false) {
        document.getElementById(elementId).innerHTML = innerCode;
    } else if (switcher === true) {
        document.getElementById(elementId).innerHTML = ``;
    }
}

//UI Elements Change Main Date Text
var changeMainDate = (month = ``, year = ``) => {
    document.getElementById(saveElementIds.mainDate).innerHTML = `${month} ${year}`;
}

//UI Elements Filter By Date
var filterByDate = (leftElementList, rightElementList, yearId, monthId, dayId) => {
    var yCheck = false;
    var mCheck = false;
    var dCheck = false;
    
    var leftListCompressed = [];
    var rightListCompressed = [];
    
    var filterFunction = (type = `def`) => {
        var year = parseInt(document.getElementById(yearId).value);
        var month = parseInt(document.getElementById(monthId).value);
        var day = parseInt(document.getElementById(dayId).value);

        //Clearing Left List
        if (leftListCompressed.length > 0) {
            if (leftListCompressed[0] !== 'noElement') {
                clearNodeArrays(leftListCompressed, "incomeList", 'income');
            }
        } else if (leftListCompressed.length === 0) {
            leftElementList.length > 0? clearNodeArrays(leftElementList, "incomeList", 'income'): () => {};
        }
        
        if (rightListCompressed.length > 0) {
            if (rightListCompressed[0] !== 'noElement') {
                clearNodeArrays(rightListCompressed, "expensesList", 'expenses');
            }
        } else if (rightListCompressed.length === 0) {
            rightElementList.length > 0? clearNodeArrays(rightElementList, "expensesList", 'expenses'): () => {};
        }
        
        leftListCompressed.length = 0;
        rightListCompressed.length = 0;

        incomeSum = 0;
        for (current of leftElementList) {
            if (type === 'def') {
                leftListCompressed.push(current);
                incomeSum += current[0].inputValue;
            } else if (type === 'year') {
                if (current[0].created.getFullYear() === year) {
                    leftListCompressed.push(current);
                    incomeSum += current[0].inputValue;
                } else {
                    continue;
                }
            } else if (type === 'months') {
                if (current[0].created.getFullYear() === year && current[0].created.getMonth() === month) {
                    leftListCompressed.push(current);
                    incomeSum += current[0].inputValue;
                } else {
                    continue;
                }
            } else if (type === 'days') {
                if (current[0].created.getFullYear() === year && current[0].created.getMonth() === month && current[0].created.getDate() === day) {
                    leftListCompressed.push(current);
                    incomeSum += current[0].inputValue;
                } else {
                    continue;
                }
            }
        }
        //Sorting Arrays
        leftListCompressed.sort(sortArrayByDate('-created'));

        expensesSum = 0;
        for (current of rightElementList) {
            if (type === 'def') {
                rightListCompressed.push(current);
                expensesSum += current[0].inputValue;
            } else if (type === 'year') {
                if (current[0].created.getFullYear() === year) {
                    rightListCompressed.push(current);
                    expensesSum += current[0].inputValue;
                } else {
                    continue;
                }
            } else if (type === 'months') {
                if (current[0].created.getFullYear() === year && current[0].created.getMonth() === month) {
                    rightListCompressed.push(current);
                    expensesSum += current[0].inputValue;
                } else {
                    continue;
                }
            } else if (type === 'days') {
                if (current[0].created.getFullYear() === year && current[0].created.getMonth() === month && current[0].created.getDate() === day) {
                    rightListCompressed.push(current);
                    expensesSum += current[0].inputValue;
                } else {
                    continue;
                }
            }
        }
        //Sorting Arrays
        rightListCompressed.sort(sortArrayByDate('-created'));

        //Refreshing Left Percentage Values
        refreshValues(leftListCompressed, incomeSum);
        //Refreshing Right Percentage Values
        refreshValues(rightListCompressed, expensesSum);

        //Refresh Left Element List
        refreshElementList(leftListCompressed, incomeElementCreate, "incomeList");
        //Refresh Right Element List
        refreshElementList(rightListCompressed, expensesElementCreate, "expensesList");

        //Refreshing Upper Part
        //Creating Upper Part
        upperPart(leftListCompressed, rightListCompressed, false);
        
        if (leftListCompressed.length === 0) {
            leftListCompressed.push('noElement');
        }
        if (rightListCompressed.length === 0) {
            rightListCompressed.push('noElement');
        }

    }
    
    document.getElementById(yearId).addEventListener('click', () => {
        if (yCheck === true) {
            if (document.getElementById(yearId).value !== 'blankOption') {
                changeMainDate('', document.getElementById(yearId).value);
                filterFunction('year');
            } else {
                var dateDate = new Date();
                changeMainDate(monthsNameArr[dateDate.getMonth()], dateDate.getFullYear());
                filterFunction('def');
            }
            yCheck = false;
        } else {
            yCheck = true;
        }
    })
    
    document.getElementById(monthId).addEventListener('click', () => {
        if (mCheck === true) {
            if (document.getElementById(monthId).value !== 'blankOption') {
                if (document.getElementById(yearId).value !== 'blankOption') {
                    var month = parseInt(document.getElementById(monthId).value);
                    month = monthsNameArr[month];
                    changeMainDate(month, document.getElementById(yearId).value);
                }
                filterFunction('months');
            } else {
                filterFunction('year');
                changeMainDate('', document.getElementById(yearId).value);
            }
            mCheck = false;
        } else {
            mCheck = true;
        }
    });
    
    document.getElementById(dayId).addEventListener('click', () => {
        if (dCheck === true) {
            if (document.getElementById(dayId).value !== 'blankOption') {
                filterFunction('days');
            } else {
                filterFunction('months');
            }
            dCheck = false;
        } else {
            dCheck = true;
        }
    });
}

//Login Changer
var openLoginPage = (switchType = false, data = {}, type = `update`, launchSlide = true) => {
    var newNode;
    if (switchType === false) {
        newNode = '<p class="upperText" id="signup">SIGN UP</p><p class="upperText" id="login">LOG IN</p>'
        document.getElementById('authenticatePart').innerHTML = newNode;
        
        //Creating Sign Up UI
        document.getElementById('signup').onclick = () => {
            openLoginPage('userPage', undefined, 'register');
        }
    } else if (switchType === true) {
        newNode = "<form class='authForm' id='loginForm'><input class='authInput' type='text' placeholder='USERNAME' name='userName' id='userName'><input class='authInput' type='password' placeholder='PASSWORD' name='password' id='password'><input type='button' class='authButton' id='authforgotPass' value='forgot?' onclick='sendforgotPassRequest()'><input type='button' class='authButton' id='authSubmit' value='login' onclick='connectServer()'><input type='button' class='authButton' id='authClose' value='close' onclick='openLoginPage()'></form>";
        document.getElementById('authenticatePart').innerHTML = newNode;
        //Creating Enter Key Event Listener for login
        var element =  document.getElementById('authSubmit');
        if (typeof(element) != 'undefined' && element != null) {
            document.addEventListener('keypress', (event) => {
                if (event.keyCode === 13 || event.watch === 13) {
                    if (loginChecker === true) {
                        if (document.activeElement.id === 'userName') {
                            document.getElementById('password').focus();
                        } else if (document.activeElement.id === 'password' || document.activeElement === 'authSubmit') {
                            document.getElementById('authSubmit').click();
                            
                            //Preventing Sending Multiple Requests On Login
                            loginChecker = false;
                        } else if (document.activeElement.id === 'authforgotPass') {
                            document.getElementById('authforgotPass').click();
                        } else if (document.activeElement.id === 'authClose') {
                            document.getElementById('authClose').click();
                        }
                    }
                }
            })
        }
    } else if (switchType === 'userName') {
        loginId = data.userName;
        var width = data.userName.length * 20;
        newNode = document.createElement('p');
        newNode.className = 'upperText';
        newNode.id = data.userName;
        newNode.style.width = `${width}px`;
        newNode.innerText = data.userName;
        //newNode = `<p class="upperText" id="${data}" style="width: ${data.length * 20}">${data}</p>`;
        document.getElementById('authenticatePart').innerHTML = '';
        document.getElementById('authenticatePart').appendChild(newNode);
        document.getElementById(data.userName).onclick = () => {
            openLoginPage('userPage', data, 'update');
        }
    } else if (switchType === 'userPage') {
        if (type === 'update') {
            var newNode = userPageCreate(type,data.userName, data.email, data.firstName, data.lastName, data.age, data.sex, data.avIncome, data.avIncomeDescription, data.setAvIncome);
            document.getElementById('userData').innerHTML = '';
            document.getElementById('userData').appendChild(newNode);
            document.getElementById('userData').style.display = 'block';
            
            if (data.sex === 'Male') {
                document.getElementById('sexInput').value = 'Male';
            } else if (data.sex === 'Female') {
                document.getElementById('sexInput').value = 'Female';
            }

            if (data.setAvIncome === true) {
                document.getElementById('setAvIncomeInput').value = true;
            } else if (data.setAvIncome === false) {
                document.getElementById('setAvIncomeInput').value = false;
            }

            //Save Button
            document.getElementById('saveButton').onclick = () => {
                saveUserData(saveElementIds);
            }
            
            //Reset Button
            document.getElementById('resetButton').onclick = () => {
                openLoginPage('userPage', data, 'update', false);
            }
            
            //Log Out Button
            document.getElementById('logoutButton').onclick = () => {
                sendLogoutRequest();
                loginChecker = false
            }
            setDate('dayInput', 'monthInput', 'yearInput', [data.birthDay, data.birthMonth, data.birthYear]);
        } else if (type === 'register') {
            var newNode = userPageCreate(type);
            document.getElementById('userData').innerHTML = '';
            document.getElementById('userData').appendChild(newNode);
            document.getElementById('userData').style.display = 'block';
            setDate('dayInput', 'monthInput', 'yearInput');
            
            //Save Button
            document.getElementById('saveButton').onclick = () => {
                saveUserData(saveElementIds, type);
            }
            
            //Reset Button
            document.getElementById('resetButton').onclick = () => {
                openLoginPage('userPage', undefined, 'register', false);
            }
        }
        
        if (launchSlide === true) {
            moveLeftShow('userData', 325, 0, 4, 1);
        }
        
        //Close Button
        document.getElementById('closeButton').onclick = () => {
            moveLeftHide('userData', 0, 325, 4, 1);
        }
        
    }
}
