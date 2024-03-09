const { tokens } = require('./tokens.js'); // Because it didn't like ES6 I guess

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    str() {
        const { type, value } = this;
        return `Token(${type}, ${value})`
    }
}

class Interpreter {
    constructor(text, tokens) {
        this.text = text.replace(/\s+/g, ''); // Remove all whitespace with a regex
        this.tokens = tokens;
        this.pos = 0;
        this.currentChar = this.text[this.pos]; // Default to the first character
        this.currentToken = null;
    }

    // Increment the position pointer and modify the current character accordingly
    advance() {
        const { text } = this;

        this.pos += 1;
        // If the index has reached the end of the line, set the current character to null
        if (this.pos > text.length-1) {
            this.currentChar = null;

        } else {
        // Otherwise, define the current character
            this.currentChar = text[this.pos]
        }
    }

    // Concatenate digits of an integer until it finds a non-integer
    integer() {
        let result = '';

        // If the current character is not null and is a digit, concatenate it to the 
        // result and advance the pointer
        while (this.currentChar != null && this.currentChar.match(/[0-9]/)) {
            result += this.currentChar;
            this.advance();
        }
        // Convert the string to a number and return it
        return +result;
    }

    getNextToken() {
        // Note that we can't destructure anything else because they are set to fixed 
        // values in the constructor
        const { tokens } = this;

        if (this.currentChar != null) {
            // If the current character is an integer, return an 'INTEGER' token
            if (this.currentChar.match(/[0-9]/)) {
                return new Token('INTEGER', this.integer());
            }

            // If the current character is a predefined token in tokens.js, return the
            // token type and value accordingly
            if (this.currentChar in tokens) {
                const operator = new Token(tokens[this.currentChar], this.currentChar);
                this.advance();
                return operator;
            }

        } else {
            return new Token('EOF', null);
        }
    }

    // "Eat" the current token and go on to the next
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.getNextToken();   

        } else {
            return 'Invalid token type';
        }
    }

    expr() {
        const { tokens } = this;

        this.currentToken = this.getNextToken();

        // Set the first token to the current token
        const left = this.currentToken;
        this.eat('INTEGER');

        // Set the second token to the current token
        const operator = this.currentToken;
        this.eat(tokens[operator.value]);

        // Set the third token to the current token
        const right = this.currentToken;
        this.eat('INTEGER');

        let result;

        if (operator.type == 'PLUS') {
            result = left.value + right.value;
        } else if (operator.type == 'MINUS') {
            result = left.value - right.value;
        } else if (operator.type == 'TIMES') {
            result = left.value * right.value;
        } else if (operator.type == 'DIVIDE') {
            result = left.value/right.value;
        }

        return result;
    }

}

interpreter = new Interpreter('96 / 32', tokens);

console.log(interpreter.expr());
