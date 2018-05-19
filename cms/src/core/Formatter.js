let Formatter = {};

Formatter.format = (type, value) => {
    let mapping = [
        { "type": "date", "func": Formatter.formatDate },
        { "type": "number", "func": Formatter.formatNumber },
        { "type": "amount", "func": Formatter.formatAmount }
    ];

    let func = mapping.find((item) => item.type === type).func;
    return func(value);
}

Formatter.formatDate = (value) => {
    return value;
};

Formatter.formatNumber = (value) => {
    if (!value || isNaN(value)) return value;
    let amount = parseFloat(value);
    return amount.toFixed();
};

Formatter.formatAmount = (value) => {
    if (!value || isNaN(value)) return value;
    let amount = parseFloat(value);
    return amount.toFixed(2);
};


export default Formatter;
