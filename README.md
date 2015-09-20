DI Node [![Build Status](https://travis-ci.org/igorzg/di-node.svg)](https://travis-ci.org/igorzg/di-node)
====

# Support
* [Dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) for nodejs >= v4.0.0
* Path aliases
* Dynamic module definitions
* Module mocking for easier testing

Usage of older version presentation on MNUG bounded to [MVCJS](https://www.youtube.com/watch?v=Jc4B39acWYc).
> Example of [CMS](https://github.com/igorzg/js_cms) app on older version.

# Usage
Dependency injection provides you ioc and great testing features.
Module returns single instance of dependency injection.
> While using di-node, do not load anything via require, except di-node otherwise you will not be able to mock that object or provide custom implementation of that object when it's needed.

### Example module.js
```javascript
let di = require('di-node');
let Type = di.load('typed-js');
let fs = di.load('fs');

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
```
### Test of class D 
```javascript
it('mock', () => {
    class A {
        constructor(config) {
            expect(config).toEqual({name: 'str'});
        }
    }
    A.STRING = 'str';
    di.setAlias('b', __dirname + '/b');
    let val = di.load('@{b}/di-test');
    expect(val instanceof Type).toBe(true);
    let valMock = di.mock('@{b}/di-test', {
        'typed-js': A
    });
    expect(valMock instanceof A).toBe(true);
});
```

# DI Methods

## di.load(key)
While using di-node do not load anything via require except di-node otherwise you will not be able to mock that object
or provide custom implementation of that object when it's needed.

### di.load Valid
```javascript
'use strict';

let di = require('di-node');
let Type = di.load('typed-js');
let fs = di.load('fs');

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
```

### di.load Invalid
Because you will not be able to mock fs when it's needed
```javascript
'use strict';

let di = require('di-node');
let Type = di.load('typed-js');
let fs = require('fs');

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
```

## di.mock(module, modules)
Mock is used for testing purposes
{string} module
{Object} definition of modules
```javascript
it('mock', () => {
    class A {
        constructor(config) {
            expect(config).toEqual({name: 'str'});
        }
    }
    A.STRING = 'str';
    di.setAlias('b', __dirname + '/b');
    let val = di.load('@{b}/di-test');
    expect(val instanceof Type).toBe(true);
    let valMock = di.mock('@{b}/di-test', {
        'typed-js': A
    });
    expect(valMock instanceof A).toBe(true);
});
```


## di.setAlias(key, value)
Sets specific path alias which can be used in load method
{string} key
{string} value
```javascript
// set aliases
di.setAlias('app', __dirname + '/app');
di.setAlias('components', '@{app}/components');
// usage
di.load('@{app}/module');
di.load('@{components}/redis');
```
## di.getAlias(key)
Get specific alias
{string} key
return {string}
```javascript
di.setAlias('app', __dirname + '/app');
di.getAlias('app'); // returns __dirname/app
```
## di.hasAlias(key)
Check if alias is setted
return {boolean}
```javascript
di.setAlias('app', __dirname + '/app');
di.hasAlias('app'); // true
```
## di.normalize(key)
Normalize path
return {string}
```javascript
di.setAlias('app', '/app');
di.setAlias('components', '@{app}/components');
di.normalize('@{components}/path'); //  returns /app/components/path
```


## di.setModule(key, value)
Set specific module
{string} key
{Object|Any} value
```javascript
// My fs implementation
di.setModule('fs', {
    readFileSync: {
    
    }
});
di.setModule('app/info', '@{app}/core/info');
// usage
di.load('fs'); // will load custom implementation
di.load('app/info'); // will load appPath/core/info.js
```

## di.getModule(key)
Get specific module
{string} key
return {Object|Any} value
```javascript
di.setModule('fs', {
    readFileSync: {
    
    }
});
di.getModule('fs'); // returns custom fs module
```
### di.hasModule(key)
Check if module is registered in di 
return {boolean}
```javascript
di.setModule('custom', {
    readFileSync: {
    
    }
});
di.hasModule('custom'); // true
```





