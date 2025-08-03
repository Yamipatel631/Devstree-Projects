const display = document.getElementById('display');

function appendNumber(num) {
    display.value += num;
}

function appendOperator(op) {
    if (display.value === '' && (op === '+' || op === '-' || op === '*' || op === '/')) {
        return;
    }
    const lastChar = display.value.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + op;
    } else {
        display.value += op;
    }
}

function clearDisplay() {
    display.value = '';
}

function del() {
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    try {
        display.value = math.evaluate(display.value);
    } catch (error) {
        display.value = 'Error';
    }
}

