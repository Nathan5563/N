const { tokens } = require('./tokens.js');
const { Lexer } = require('./lexer.js');

/////////////////////////////////////////////////////
// Parser / Interpreter code                        /
/////////////////////////////////////////////////////
class Interpreter {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken(); // Default to the first token
    }

    error() {
        throw 'Invalid Syntax';
    }

    eat(tokenType) { // "Eat" the current token and go on to the next
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();

        } else {
            this.error();
        }
    }

    factor() { // Return an integer value from the current token
        const token = this.currentToken;
        if (token.type == 'INTEGER') {
            this.eat('INTEGER');
            return token.value;

        } else if (token.type == 'LPAREN') {
            this.eat('LPAREN');
            const result = this.expr();
            this.eat('RPAREN');
            return result;

        } else {
            this.error();
        }
    }

    term() { // Perform any multiplications/divisions first
        let result = this.factor();

        // While the current token is MUL or DIV, loop the arithmetic
        while (this.currentToken.type == 'MUL' || this.currentToken.type == 'DIV') {
            const operator = this.currentToken.type;
            if (operator == 'MUL') {
                this.eat('MUL');
                result *= this.factor(); // Continuously multiply/divide to the previous integer

            } else if (operator == 'DIV') {
                this.eat('DIV');
                result /= this.factor();
            }
        }
        return result;
    }

    expr() {
        // Set the first token to any multiplication/division results present
        let result = this.term()

        // While the current token is ADD or SUB, loop the arithmetic
        while (this.currentToken.type == 'ADD' || this.currentToken.type == 'SUB') {
            const operator = this.currentToken.type;
            if (operator == 'ADD') {
                this.eat('ADD');
                result += this.term(); // Continuously add/subtract to the previous product/quotient

            } else if (operator == 'SUB') {
                this.eat('SUB');
                result -= this.term();
            }
        }
        return result;
    }

}

const lexer = new Lexer('5 * (6 + (4 / 10 * (3 + 3)))', tokens);
const interpreter = new Interpreter(lexer);

console.log(interpreter.expr());
// Expected output: 46