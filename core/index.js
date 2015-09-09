"use strict";

let Type = require("typed-js");
/**
 * @license Mit Licence 2014
 * @since 0.1.0
 * @author Igor Ivanovic
 * @name DI
 *
 * @constructor
 * @description
 * DI is main object for handling dependency injection
 */
class DI extends Type {
    constructor() {
        super({
            aliases: Type.OBJECT,
            filePaths: Type.OBJECT
        });
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#normalize
     *
     * @description
     * Normalize path
     */
    normalize(value) {
        if (Type.isString(value)) {
            Object.keys(this.aliases).forEach(key => {
                value = value.replace("@{" + key + "}", this.aliases[key]);
            });
            return path.normalize(value);
        } else {
            throw new Error(`DI.normalize: ${value} is not string`);
        }
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#hasAlias
     * @param {String} key
     *
     * @description
     * Has an alias
     */
    hasAlias(key) {
        return this.aliases.hasOwnProperty(key);
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#getAlias
     * @param {String} key
     *
     * @description
     * Get an path alias
     */
    getAlias(key) {
        if (this.hasAlias(key)) {
            return this.normalize(this.aliases[key]);
        }
        throw new Error(`DI.getAlias: ${key} is not in registered as alias`);
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#setAlias
     * @param {String} key
     * @param {String} val
     *
     * @description
     * Set an path alias
     */
    setAlias(key, val) {
        this.aliases[key] = val;
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#refereshNodeModuleCache
     * @param {String} file
     *
     * @description
     * Refreshes node module
     */
    refereshNodeModuleCache(file) {
        let path = this.getFilePath(file);
        let key = require.resolve(path + ".js");
        delete require.cache[key];
        return path;
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#hastFilePath
     * @param {String} key
     *
     * @description
     * Check if key exists in file paths
     */
    hastFilePath(key) {
        return this.filePaths.hasOwnProperty(key);
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#hastFilePath
     * @param {String} key
     * @param {String} value
     *
     * @description
     * Check if key exists in file paths
     */
    setFilePath(key, value) {
        this.filePaths[key] = value;
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#getFilePath
     * @param {String} key
     *
     * @description
     * Return file path
     */
    getFilePath(key) {
        if (this.hastFilePath(key)) {
            key = this.filePaths[key];
        }
        return this.normalize(key);
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#mock
     * @param {String} file
     * @param {Object} mocks
     *
     * @description
     * Return module with mocked objects
     */
    mock(file, mocks) {
        let load = DI.prototype.load;
        // mock load
        DI.prototype.load = name => {
            return mocks[name];
        };

        try {
            // load module or exec if its function
            if (Type.isString(file)) {
                // do require
                return require(this.refereshNodeModuleCache(file));
            } else if (Type.isFunction(file)) {
                return file();
            }
        } catch (e) {
            return e;
        } finally {
            DI.prototype.load = load;
        }
    }
    /**
     * @since 0.1.0
     * @author Igor Ivanovic
     * @function
     * @name DI#load
     * @param {String} key
     *
     * @description
     * Return loaded module
     */
    load(key) {
        try {
            return require(this.getFilePath(key));
        } catch (e) {
            throw new Error(`DI.load ${e}`);
        }
    }
}

module.exports = new DI;
module.exports.DI = DI;
