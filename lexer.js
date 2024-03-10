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

/////////////////////////////////////////////////////
// Lexer code                                       /
/////////////////////////////////////////////////////
class Lexer {
    constructor(text, tokens) {
        this.text = text;
        this.tokens = tokens;
        this.pos = 0;
        this.currentChar = this.text[this.pos]; // Default to the first character
    }

    error() {
        throw 'Invalid Character';
    }

    skipWhitespace() {
        while (this.currentChar != null && this.currentChar === ' ') {
            this.advance();
        }
    }

    advance() { // Increment the position pointer and modify the current character accordingly
        const { text } = this;

        this.pos += 1;
        // If the index has reached the end of the line, set the current character to null
        if (this.pos > text.length - 1) {
            this.currentChar = null;

        } else {
            // Otherwise, define the current character
            this.currentChar = text[this.pos]
        }
    }

    integer() { // Concatenate digits of an integer until it finds a non-integer
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

    // Lexical analyzer
    getNextToken() {
        // Note that we can't destructure anything else because they are set to fixed 
        // values in the constructor
        const { tokens } = this;

        while (this.currentChar != null) {
            // If the current character is whitespace, skip it
            if (this.currentChar === ' ') {
                this.skipWhitespace();
                continue;
            }

            // If the current character is an integer, return an 'INTEGER' token
            if (this.currentChar.match(/[0-9]/)) {
                return new Token('INTEGER', this.integer());
            }

            // If the current character is a predefined token in tokens.js, return the
            // token type and value accordingly
            if (this.currentChar in tokens) {
                const token = new Token(tokens[this.currentChar], this.currentChar);
                this.advance();
                return token;
            }

            this.error();
        }
        return new Token('EOF', null);
    }
}

module.exports = { Lexer };