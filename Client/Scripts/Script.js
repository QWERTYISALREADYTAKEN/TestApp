var sumAmountDiv = document.getElementById("availableAmount");
var incomeAmountDiv = document.getElementById("incomeUpperAmount");
var expensesAmountDiv = document.getElementById("expensesUpperAmount");
var percentageUpperDiv = document.getElementById("upperPercentage");

var submitInput = document.getElementById("submitIcon");

var plusMinus = document.getElementById("plusMinusChoice");
var typeDescription = document.getElementById("description");
var typeValue = document.getElementById("numberValue");
var typeChanger = "income";
var plusMinusCheck;

var leftElementList = [];
var rightElementList = [];

var incomeSum = 0;
var expensesSum = 0;

var incomeNum = 0;
var expensesNum = 0;

var leftCounter = 0;
var rightCounter = 0;

var sumOfAll;

var monthsNameArr;

//-------------------------------------------------------------------

//Initializing App
(function () {
    sumAmountDiv.textContent = "+ 0.00";
    incomeAmountDiv.textContent = "+ 0.00";
    expensesAmountDiv.textContent = "- 0.00";
    percentageUpperDiv.textContent = "__";
    
    //Getting Current Time
    var currentDate = new Date();
    monthsNameArr= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthsNameArr=monthsNameArr.map(e => e = e.toUpperCase());
    
    document.getElementById("dateTime").textContent = monthsNameArr[currentDate.getMonth()] + " " + currentDate.getFullYear();
    
    
})();

//-------------------------------------------------------------------
function randomString(length = 'noL') {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (length === 'noL') {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

//InputClearing
function clearInput() {
    typeDescription.value = "";
    typeValue.value = "";
}

//Making Input
(function () {
    plusMinus.onclick = function() {
        plusMinusCheck = plusMinus.value;
        
        if (plusMinusCheck == "+") {
            typeChanger = "income";
            outlineColorChange();
        } else if (plusMinusCheck == "-") {
            typeChanger = "expenses";
            outlineColorChange();
        }
        
}})();

//Changing OutLine Color
function outlineColorChange() {
    if (typeChanger === "income") {
        plusMinus.classList.toggle("inputTypeGreen");
        typeDescription.classList.toggle("inputTypeGreen");
        typeValue.classList.toggle("inputTypeGreen");
        submitInput.src = "Pics/Icons/IncomeCheck.png";
    } else if (typeChanger === "expenses") {
        plusMinus.classList.toggle("inputTypeRed");
        typeDescription.classList.toggle("inputTypeRed");
        typeValue.classList.toggle("inputTypeRed");
        submitInput.src = "Pics/Icons/ExpensesCheck.png";
    }
}

//Changing Focus
function changeFocus(leftElement, rightElement, middleElement) {
    document.getElementById(middleElement)
    .addEventListener("keyup", function(event) {
    event.preventDefault();
        if (event.keyCode === 39) {
            document.getElementById(rightElement).focus();
        } else if (event.keyCode === 37) {
            document.getElementById(leftElement).focus();
        } else if (event.keyCode === 13) {
            document.getElementById(rightElement).focus();
        }
    });
}


//Assigning Keyes
(function() {
    document.getElementById("numberValue")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13 && typeValue.value !== "") {
        document.getElementById("submitIcon").click();
    }
    });
    
    document.addEventListener("keypress", function(event) {
        if (event.keyCode === 59 || event.which === 59) {
            plusMinus.value = "+";
            plusMinus.click();
            outlineColorChange();
        } else if (event.keyCode === 39 || event.which === 39) {
            plusMinus.value = "-";
            plusMinus.click();
            outlineColorChange();
        }
    })
    
    changeFocus("numberValue", "numberValue", "description");
    changeFocus("description", "description", "numberValue")
})();

//-------------------------------------------------------------------

//Number Formatting
function formatNumber(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

//-------------------------------------------------------------------

//Creating Upper Values
function upperPart(leftElementList, rightElementList, reverseIt, incomeNum = 0, expensesNum = 0) {
    
    if (reverseIt === false) {
        for(var i = 0; i < leftElementList.length; i++) {
        incomeNum = incomeNum + leftElementList[i][0].inputValue;
        }
        for(var i = 0; i < rightElementList.length; i++) {
            expensesNum = expensesNum + rightElementList[i][0].inputValue;
        }
    } else if (reverseIt === true) {
        for(var i = 0; i < rightElementList.length; i++) {
        incomeNum = incomeNum + rightElementList[i][0].inputValue;
        }
        for(var i = 0; i < leftElementList.length; i++) {
            expensesNum = expensesNum + leftElementList[i][0].inputValue;
        }
    }
    
    incomeNum = parseFloat((incomeNum).toFixed(2));
    expensesNum = parseFloat((expensesNum).toFixed(2));
    
    if (incomeNum === 0) {
        incomeAmountDiv.textContent = "+ 0.00";
    } else {
        incomeAmountDiv.textContent = "+ " + formatNumber(incomeNum);
    }
    
    if (expensesNum === 0) {
        expensesAmountDiv.textContent = "- 0.00";
    } else {
        expensesAmountDiv.textContent = "- " + formatNumber(expensesNum);
    }
    
    upperPercentage(incomeNum, expensesNum);
        
    var sumNum = parseFloat((incomeNum - expensesNum).toFixed(2));
    
    if (sumNum >= 0) {
        sumAmountDiv.textContent = "+ " + formatNumber(sumNum);
    } else if (sumNum < 0) {
        sumAmountDiv.textContent = "- " + formatNumber(sumNum - (2 * sumNum));
    }
    
}

//-------------------------------------------------------------------

var expensesPercentage = function(firstNumber, secondNumber) {
    return Math.floor((firstNumber / secondNumber) * 100);
};

//Creating Upper Percentage
function upperPercentage(valueOfIncome, valueOfExpenses) {
    
    if (valueOfIncome > 0) {
        percentageUpperDiv.textContent = expensesPercentage(valueOfExpenses, valueOfIncome) + "%";
    } else if (valueOfIncome === 0 || valueOfIncome < 0) {
        percentageUpperDiv.textContent = "--%";
    }
}

//-------------------------------------------------------------------

//Element Remove Function
function removeElement(newDiv, typeSum, createFN, elementList, secondElementList, listType, typeChanger, reverseIt) {
    
    //Finding Index Of Removing Element
    removeElementIndex = parseInt(newDiv.childNodes[1].id.charAt(newDiv.childNodes[1].id.length - 1));

    //Creating New Sum Deleting From The List
    typeSum = typeSum - elementList[removeElementIndex][0].inputValue;
    
    //Taking id From Removing element
    var elementID = elementList[removeElementIndex][0].id;
    var elementType = elementList[removeElementIndex][0].type;
    
    elementList.splice(removeElementIndex, 1);

    //Refreshing Values
    refreshValues(elementList, typeSum);

    //Refreshing List
    clearNodeArrays(elementList, listType, typeChanger);
    document.getElementById(listType).innerHTML = "";
    refreshElementList(elementList, createFN, listType);
    
    //Some Errors With Percentage
        sumOfAll = 0;

        for (var i = 0; i < elementList.length; i++) {
            sumOfAll = sumOfAll + elementList[i][0].inputValue;
        }

        if (typeChanger === "income") {
            incomeSum = sumOfAll;
        } else if (typeChanger === "expenses") {
            expensesSum = sumOfAll;
        }
    
    //Refreshing Upper Part
    upperPart(elementList, secondElementList, reverseIt);
    
    //Sending request to remove element with id
    sendRemoveID(elementID, elementType);

    //--------------------------------------------------------
    //console.log(elementList);
    for (var i = 0; i < elementList.length; i++) {
        //console.log(elementList[i][1][0]);
    }
}

//-------------------------------------------------------------------

//Creating New Income Element
function incomeElementCreate(description, value, elementArray) {
    var childNode = [];
    
    var newDiv = document.createElement("div");
    newDiv.id = "incomeListElement" + leftCounter;
    newDiv.className = "incomeListElement";

    newDiv.innerHTML = "<div class=\"incomeListElementDescription\" id=\"incomeListElementDescription" + leftCounter + "\">" + description + "</div>" + 
    "<img src=\"Pics/Icons/IncomeCross.png\" class=\"incomeCross\" id=\"incomeCross" + leftCounter +"\">" +
    "<div class=\"incomeListElementValue\" id=\"listElementValue" + leftCounter + "\"> + " + formatNumber(value) + "</div>";
    
    //Hover Object
    var mouseHover = new mouseHoverFunctionIncome(newDiv);
    mouseHover.mouseHoverCheckChanger(newDiv);
    
    //Element Remove
    newDiv.childNodes[1].onclick = function() {
        removeElement(newDiv, incomeSum, incomeElementCreate, leftElementList, rightElementList, "incomeList", "income", false);
    }
    
    //Adding Div, HoverFunction And Counter To childNode[]
    childNode.push(newDiv);
    childNode.push(leftCounter);
    childNode.push(mouseHover);
    
    //Adding childNode To Element Array
    elementArray.splice(1, 0, childNode);

    leftCounter++;
}

//Creating New Expenses Element
function expensesElementCreate(description, value, elementArray, percentage) {
    var childNode = [];
    
    var newDiv = document.createElement("div");
    newDiv.id = "expensesListElement" + rightCounter;
    newDiv.className = "expensesListElement";

    newDiv.innerHTML = "<div class=\"expensesListElementDescription\" id=\"expensesListElementDescription" + rightCounter + "\">" + description + "</div>" + 
    "<img src=\"Pics/Icons/ExpensesCross.png\" class=\"expensesCross\" id=\"expensesCross" + rightCounter +"\">" +
    "<div class=\"expensesPercentageShow\" id=\"expensesPercentageShow" + rightCounter + "\">" + percentage + "%" + "</div>" +
    "<div class=\"expensesListElementValue\" id=\"expenseslistElementValue" + rightCounter + "\"> - " + formatNumber(value) + "</div>";
    
    //Hover Object
    var mouseHover = new mouseHoverFunctionExpenses();
    mouseHover.mouseHoverCheckChanger(newDiv);
    
    //Element Remove
    newDiv.childNodes[1].onclick = function() {
        removeElement(newDiv, expensesSum, expensesElementCreate, rightElementList, leftElementList, "expensesList", "expenses", true);
    }
    
    //Adding Div, HoverFunction And Counter To childNode[]
    childNode.push(newDiv);
    childNode.push(rightCounter);
    childNode.push(mouseHover);
    
    //Adding childNode To Element Array
    elementArray.splice(1, 0, childNode);

    rightCounter++;
}

//-------------------------------------------------------------------

//Refresh Percentages
function refreshValues(listArray, inputSum) {
    
    if (listArray.length > 0) {
        for (var i = 0; i < listArray.length; i++) {
            
            listArray[i][0].percentage = parseFloat(((listArray[i][0].inputValue / inputSum) * 100).toFixed(2));
            
            //console.log(listArray[i][0].percentage + " Percentage");
        }
    }
    
}

//-------------------------------------------------------------------

//Clearing ElementArrays And Nodes
function clearNodeArrays(listArray, elementName, typeChanger) {
    for (var i = 0; i < listArray.length; i++) {
        document.getElementById(elementName).removeChild(listArray[i][1][0]);
        
        listArray[i].splice(1,1);
    }
    
    if (typeChanger === "income") {
        leftCounter = 0;
    } else if (typeChanger === "expenses") {
        rightCounter = 0;
    }
}

//Creating New Loop For Refreshed List
function refreshElementList(listArray, createFN, elementName) {
    for (var i = 0; i < listArray.length; i++) {
       createFN(listArray[i][0].description, listArray[i][0].inputValue, listArray[i], listArray[i][0].percentage);
        document.getElementById(elementName).appendChild(listArray[i][1][0]);
    }
}

//Building UI function
var buildUI = (listArray, elementName, typeChanger, amountSum, createFN) => {
    // Clearing Nodes And An Array
            
    clearNodeArrays(listArray, elementName, typeChanger);
    
    //Refreshing Percentage Values
            
    refreshValues(listArray, amountSum);
    
    //Refresh Element List
    
    refreshElementList(listArray, createFN, elementName);
}

//-------------------------------------------------------------------

//Adding Input
(function() {
    submitInput.onclick = function() {
        
        //parseFloat
        var inputNumber = parseFloat(parseFloat(typeValue.value).toFixed(2));
        
        if (typeChanger === "income" && !isNaN(inputNumber)) {
            
            // Clearing Nodes And An Array
            
            clearNodeArrays(leftElementList, "incomeList", typeChanger);
            
            //------------------------------------------------------
            
            incomeSum = incomeSum + inputNumber;
            
            //------------------------------------------------------
            
            //Refreshing Percentage Values
            
            refreshValues(leftElementList, incomeSum);
            
            //Creating Element
            var elementArray = [];
            
            var inputObject = new listElement(typeChanger, typeDescription.value, inputNumber, incomeSum);
            
            elementArray.push(inputObject);
            
            //Adding Element Array To Element List
            
            leftElementList.push(elementArray);
            
            //Sorting Array By Date
            leftElementList.sort(sortArrayByDate('-created'));
            
            //------------------------------------------------------
            //Refresh Element List
            refreshElementList(leftElementList, incomeElementCreate, "incomeList");
            
            //Sending Add Data To The Server
            sendData(inputObject);
            
        } else if (typeChanger === "expenses" && !isNaN(inputNumber)) {
            
            // Clearing Nodes And An Array
            
            clearNodeArrays(rightElementList, "expensesList", typeChanger);
            
            //------------------------------------------------------
            
            expensesSum = expensesSum + inputNumber;
            
            //------------------------------------------------------
            
            //Refreshing Percentage Values
            
            refreshValues(rightElementList, expensesSum);
            
            //Creating Element
            var elementArray = [];
            
            var inputElement = new listElement(typeChanger, typeDescription.value, inputNumber, expensesSum);
            
            elementArray.push(inputElement);
            //expensesElementCreate
            
            //Adding Element Array To Element List
            
            rightElementList.push(elementArray);
            
            //Sorting Array By Date
            rightElementList.sort(sortArrayByDate('-created'));
            
            //------------------------------------------------------
            //Refresh Element List
            refreshElementList(rightElementList, expensesElementCreate, "expensesList");
            
            //Sending Add Data To The Server
            sendData(inputElement);
            
        }
        
        //Clearing Inputs
        clearInput();
        //Creating Upper Part
        upperPart(leftElementList, rightElementList, false);
        
        //console.log(leftElementList);
        //console.log(rightElementList);
        //removeIncomeElement();
        
    }
})();