var mouseHoverFunction = function() {

    var clearLeftInterval; //Obligatory Defining Element
    var clearLeftInitialInterval; //Obligatory Defining Element

    var clearLeftIntervalSecond; //Obligatory Defining Element
    var clearLeftInitialIntervalSecond; //Obligatory Defining Element
    
    //Left
    var moveLeftAnimation = function (inputNode, pixelAmount, milliTime) {
        clearInterval(clearLeftInitialInterval);

        clearLeftInterval = setInterval(function() {
            pixelAmount += 1;
            inputNode.childNodes[2].style.transform = "translate(" + pixelAmount + "px)";

            //console.log(pixelAmount);

            //Ends Animation After Certain Number
            if (pixelAmount === 0) {
                clearInterval(clearLeftInterval);
                //console.log("cleared");
            }

        }, milliTime);
    }

    var moveLeftAnimationSecond = function (inputNode, pixelAmount, milliTime) {
        clearInterval(clearLeftInitialIntervalSecond);

        clearLeftIntervalSecond = setInterval(function() {
            pixelAmount += 1;
            inputNode.childNodes[3].style.transform = "translate(" + pixelAmount + "px)";

            //console.log(pixelAmount);

            //Ends Animation After Certain Number
            if (pixelAmount === 0) {
                clearInterval(clearLeftIntervalSecond);
                //console.log("cleared");
            }

        }, milliTime);
    }

    var moveLeftInitial = function(inputNode, pixelAmount, milliTime) {
        clearInterval(clearLeftInterval);

        clearLeftInitialInterval = setInterval(function() {
            pixelAmount -= 1;
            inputNode.childNodes[2].style.left = pixelAmount + "px";

            //console.log(pixelAmount);

            //Ends Animation After Certain Number
            if (pixelAmount === 0) {
                clearInterval(clearLeftInitialInterval);
                //console.log("cleared");
            }

        }, milliTime);
    }

    var moveLeftInitialSecond = function (inputNode, pixelAmount, milliTime) {
        clearInterval(clearLeftIntervalSecond);

        clearLeftInitialIntervalSecond = setInterval(function() {
            pixelAmount -= 1;
            inputNode.childNodes[3].style.left = pixelAmount + "px";

            //console.log(pixelAmount);

            //Ends Animation After Certain Number
            if (pixelAmount === 0) {
                clearInterval(clearLeftInitialIntervalSecond);
                //console.log("cleared");
            }

        }, milliTime);
    }

    //--------------------------------------------------------------------

    this.expensesDefaultPosition = function (inputNode) {
        
        /*inputNode.childNodes[3].style.position = "relative";
        inputNode.childNodes[3].style.left = "25px";

        inputNode.childNodes[2].style.position = "relative";
        inputNode.childNodes[2].style.left = "35px"; */
        
        inputNode.onmouseover = function() {
            setTimeout(function() {
                inputNode.childNodes[3].style.transform = "translate(-35px)";
                inputNode.childNodes[2].style.transform = "translate(-35px)";
            }, 350);
        };
        
        inputNode.onmouseout = function() {
            inputNode.childNodes[3].style.transform = "translate(-35px)";
            moveLeftAnimation(inputNode, -35, 5);
            moveLeftAnimationSecond(inputNode, -35, 5);
        }
    }


    this.incomeDefaultPosition = function (inputNode) {
        inputNode.childNodes[2].style.position = "relative";
        inputNode.childNodes[2].style.left = "30px";
        inputNode.childNodes[2].style.background = "white";

        inputNode.onmouseover = function() {
            moveLeftInitial(inputNode, 30, 6);
            inputNode.childNodes[2].style.background = "#eaeaea";
        };
        inputNode.onmouseout = function() {
            moveLeftAnimation(inputNode, 30, 6);
            inputNode.childNodes[2].style.background = "white";
        }
    }
}
