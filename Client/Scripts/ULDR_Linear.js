var clearRightInterval; //Obligatory Defining Element
var clearRightInitialInterval; //Obligatory Defining Element
var pixelAmount = 0;

//Left
function moveLeftAnimation(elementID, initPixel, totalPXAmout, pxSpeed, milliTime) {
    pixelAmount = initPixel;
    clearInterval(clearRightInitialInterval);
    
    var i = 0;
    clearRightInterval = setInterval(function() {
        i++
        if (pxSpeed === 2.5) {
            i % 2 === 0? pxSpeed = 2: pxSpeed = 3;
        }
        pixelAmount -= pxSpeed;
        //Ends Animation After Certain Number
        if (pixelAmount <= totalPXAmout) {
            pixelAmount = totalPXAmout;
            clearInterval(clearRightInterval);
        }
        document.getElementById(elementID).style.transform = 'translate(' + pixelAmount + 'px)';
    }, milliTime);
}

function moveLeftInitial(elementID, initPixel, totalPXAmout, pxSpeed, milliTime) {
    pixelAmount = initPixel;
    clearInterval(clearRightInterval);
    
    var i = 0;
    clearRightInitialInterval = setInterval(function() {
        i++
        if (pxSpeed === 2.5) {
            i % 2 === 0? pxSpeed = 2: pxSpeed = 3;
        }
        pixelAmount += pxSpeed;
        
        //Ends Animation After Certain Number
        if (pixelAmount >= totalPXAmout) {
            pixelAmount = totalPXAmout;
            clearInterval(clearRightInitialInterval);
        }
        document.getElementById(elementID).style.transform = 'translate(' + pixelAmount + 'px)';
        
        if (pixelAmount >= totalPXAmout) {
            document.getElementById('userData').style.display = 'none';
            document.getElementById('userData').innerHTML = ''; 
        }
    }, milliTime);
}

//Down
function moveDownAnimation(elementID, initPixel, totalPXAmout, pxSpeed, milliTime) {
    pixelAmount = initPixel;
    clearInterval(clearRightInitialInterval);
    
    var i = 0;
    clearRightInterval = setInterval(function() {
        i++
        if (pxSpeed === 2.5) {
            i % 2 === 0? pxSpeed = 2: pxSpeed = 3;
        }
        pixelAmount += pxSpeed;
        //Ends Animation After Certain Number
        if (pixelAmount >= totalPXAmout) {
            pixelAmount = totalPXAmout;
            clearInterval(clearRightInterval);
        }
        document.getElementById(elementID).style.transform = 'translate(0px,' + pixelAmount + 'px)';
    }, milliTime);
}

function moveDownInitial(elementID, initPixel, totalPXAmout, pxSpeed, milliTime) {
    pixelAmount = initPixel;
    clearInterval(clearRightInterval);
    
    var i = 0;
    clearRightInitialInterval = setInterval(function() {
        i++
        if (pxSpeed === 2.5) {
            i % 2 === 0? pxSpeed = 2: pxSpeed = 3;
        }
        pixelAmount -= pxSpeed;
        
        //Ends Animation After Certain Number
        if (pixelAmount <= totalPXAmout) {
            pixelAmount = totalPXAmout;
            clearInterval(clearRightInitialInterval);
        }
        document.getElementById(elementID).style.transform = 'translate(0px,' + pixelAmount + 'px)';
        
        if (pixelAmount >= totalPXAmout) {
            document.getElementById('userData').style.display = 'none';
            document.getElementById('userData').innerHTML = ''; 
        }
    }, milliTime);
}

var moveLeftShow = (elementId, init, final, pxSpeed, ms) => {
    document.getElementById(elementId).style.transform = `translate(${init}px)`;
    //Move Function
    moveLeftAnimation(elementId, init, final, pxSpeed, ms);
}

var moveLeftHide = (elementId, init, final, pxSpeed, ms) => {
    //Move Function
    moveLeftInitial(elementId, init, final, pxSpeed, ms);
}

var moveDownShow = (elementId, init, final, pxSpeed, ms) => {
    document.getElementById(elementId).style.transform = `translate(${init}px)`;
    //Move Function
    moveDownAnimation(elementId, init, final, pxSpeed, ms);
}

var moveDownHide = (elementId, init, final, pxSpeed, ms) => {
    //Move Function
    moveDownInitial(elementId, init, final, pxSpeed, ms);
}

