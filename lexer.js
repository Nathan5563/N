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
        this.currentChar = null;
        this.currentToken = null;
    }

    advance() {
        const { text } = this;

        // If the index has reached the end of the line, set the current character to null
        if (text.length <= this.pos) {
            this.currentChar = null;

        } else {
            // Otherwise, define the current character and increment the position
            this.currentChar = text[this.pos]
            this.pos += 1;
        }
    }

    integer() {
        let result = '';
        while (this.currentChar != null) {
            if (!isNaN(this.currentChar)) {
                result += this.currentChar;
                this.advance();
            }
            if (isNaN(this.currentChar)) {
                console.log(+result);
                return +result;
            }
            console.log(result);
        }
        console.log(result);
        
    }

    getNextToken() {
        // Note that we can't destructure anything else because they are set to fixed 
        // values in the constructor
        const { tokens } = this;

        this.advance();
        if (this.currentChar != null) {

            // If the current character is an integer, return an 'INTEGER' token
            if (+this.currentChar === +this.currentChar) {
                return new Token('INTEGER', this.integer());

            } else if (this.currentChar in tokens) {
                // If the current character is a predefined token in tokens.js, return the 
                // token type and value accordingly
                return new Token(tokens[this.currentChar], this.currentChar);

            } else {
                // Log an error if the current character is not one of the above
                console.log("Unrecognized character");
                return null;
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

        // Set the first value to the current token
        const left = this.currentToken;
        this.eat('INTEGER');

        // Set the second value to the current token
        const operator = this.currentToken;
        this.eat(tokens[operator.value]);

        // Set the third value to the current token
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

        // console.log(left);
        // console.log(operator);
        // console.log(right);
        return result;
    }

}

interpreter = new Interpreter('91 + 3', tokens);

console.log(interpreter.expr());
