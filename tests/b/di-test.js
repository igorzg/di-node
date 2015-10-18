'use strict';

let DI = require('../../');
let di = new DI(require);
let Type = di.load('typed-js');

class D extends Type {
    constructor(name) {
        super(
            {
                name: Type.STRING
            }
        );
        this.name = name;
    }
}

module.exports = new D('Igor');