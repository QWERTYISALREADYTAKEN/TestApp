var listElement = function(type, description, inputValue, sum) {
    this.type = type;
    this.description = description;
    this.inputValue = inputValue;
    this.percentage = parseFloat(((inputValue / sum) * 100).toFixed(2)) || 100;
    this.id = randomString(10);
    this.created = new Date();
}