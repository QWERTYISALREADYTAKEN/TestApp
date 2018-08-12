var mouseHoverFunctionIncome = function() {
    this.mouseHoverCheck = false;
    this.mouseHoverCheckChanger = function(inputNode) {
        if (this.mouseHoverCheck === false) {
            inputNode.onmouseout = function() {
                inputNode.classList.add("incomeListElementAfterHover");
                this.mouseHoverCheck = true;
            }
        }
    }
}

var mouseHoverFunctionExpenses = function() {
    this.mouseHoverCheck = false;
    this.mouseHoverCheckChanger = function(inputNode) {
        if (this.mouseHoverCheck === false) {
            inputNode.onmouseout = function() {
                inputNode.classList.add("expensesListElementAfterHover");
                this.mouseHoverCheck = true;
            }
        }
    }
}