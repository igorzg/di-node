'use strict';


describe('di', () => {
    let Type = require('typed-js');
    let DI = require('../');
    let di;

    beforeEach(() => {
        di = new DI(require);
        di.setAlias('a', __dirname + '/a');
        di.setAlias('b', __dirname + '/b');
    });

    it('constructs', () => {
        di = new DI(require);
        expect(Type.isObject(di.aliases)).toBe(true);
        expect(Type.isObject(di.modules)).toBe(true);
        let m;
        try {
            di = new DI();
        } catch (e) {
            m = e.message;
        }
        expect(m).toBe('"require" parameter must be function type, please provide your "require" resolver');
    });

    it('setAlias', () => {


        expect(di.aliases.hasOwnProperty('a')).toBe(true);
        expect(di.aliases.hasOwnProperty('b')).toBe(true);

        expect(di.aliases.a).toBe(__dirname + '/a');
        expect(di.aliases.b).toBe(__dirname + '/b');
        let m;
        try {
            di.setAlias(1, 2);
        } catch (e) {
            m = e;
        } finally {
            expect(m.toString()).toBe('Error: DI.setAlias: 1 or 2 is not string type');
        }
    });

    it('getAlias', () => {

        expect(di.getAlias('a')).toBe(__dirname + '/a');
        expect(di.getAlias('b')).toBe(__dirname + '/b');
        let m;
        try {
            di.getAlias('c');
        } catch (e) {
            m = e;
        } finally {
            expect(m.toString()).toBe('Error: DI.getAlias: c is not in registered as alias');
        }
    });

    it('normalize', () => {
        di.setAlias('a', __dirname + '/a');
        di.setAlias('b', __dirname + '/b');
        di.setAlias('c', '@{b}/c');

        expect(di.normalize('@{a}/b')).toBe(__dirname + '/a/b');
        expect(di.normalize('@{b}/b')).toBe(__dirname + '/b/b');
        expect(di.normalize('@{c}/n')).toBe(__dirname + '/b/c/n');
        let m;
        try {
            di.normalize(1);
        } catch (e) {
            m = e;
        } finally {
            expect(m.toString()).toBe('Error: DI.normalize: 1 is not string');
        }

        try {
            di.normalize('@{d}/n');
        } catch (e) {
            m = e;
        } finally {
            expect(m.toString()).toBe(`Error: DI.normalize: @{d}/n , alias d is not defined in
                    {"a":"/Volumes/External/Github/di-node/tests/a","b":"/Volumes/External/Github/di-node/tests/b","c":"@{b}/c"} at index 0`);
        }
    });

    it('set, get, has module', () => {
        let name = __dirname + '/';
        let m = {};
        di.setModule('myname', name + 'key');
        expect(di.getModule('myname')).toBe(name + 'key');
        di.setModule('m', m);
        expect(di.getModule('m')).toBe(m);
        expect(di.hasModule('m')).toBe(true);
        expect(di.hasModule('myname')).toBe(true);

        try {
            di.setModule(1);
        } catch (e) {
            m = e;
        } finally {
            expect(m.toString()).toBe('Error: DI.setModule: 1 is not string type');
        }
    });

    it('load', () => {
        expect(di.load('@{a}/a')).toBe('A');
        expect(di.load('@{b}/a')).toBe('B');
        let m;
        try {
            di.load('@{a}/ac');
        } catch (e) {
            m = e;
        } finally {
            expect(m.toString()).toBe(`Error: DI.load ${di.normalize('@{a}/ac')} => Error: Cannot find module '${di.normalize('@{a}/ac')}'`);
        }
    });

    it('refreshModuleCache', () => {
        let k = '@{a}/time';
        let time = di.load(k);
        expect(di.load(k)).toBe(time);
        let p = di.refreshModuleCache(k);
        let key = require.resolve(p + '.js');
        expect(require.cache.hasOwnProperty(key)).toBe(false);
        let f = di.load(p);
        expect(f).not.toBe(time);
    });

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
});