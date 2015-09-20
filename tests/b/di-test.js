'use strict';

let di = require('../../core/index');
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