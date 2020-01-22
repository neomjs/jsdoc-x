'use strict';

// own modules
const jsdocx = require('../src/index');

describe('JSDoc configuration options', () => {
    let options;
    // provision options per test so tests can be run in any order and not conflict
    beforeEach(() => {
        options = {
            encoding: 'utf8',
            recurse: false,
            pedantic: false,
            access: null,
            package: null,
            module: true,
            undocumented: true,
            undescribed: true,
            relativePath: null,
            filter: null,
            allowUnknownTags: true,
            dictionaries: ['jsdoc', 'closure'],
            includePattern: '.+\\.js(doc|x)?$',
            excludePattern: '(^|\\/|\\\\)_',
            plugins: [],
            output: {
                path: './test/output/plugins-test.json',
                indent: true
            },
            config: {}
        };
    });

    // beforeAll(function () {});

    it('should throw on unknown tags', done => {
        options.source = '/**\n *  describe\n *  @unknowntag\n *  @type {Object}\n */\nconst a = {};';
        options.allowUnknownTags = false;
        jsdocx.parse(options)
            .catch(err => {
                // console.log('err', err);
                expect(err).toBeDefined();
            })
            .finally(done);
    });

    it('should allow unknown tags', done => {
        options.source = '/**\n *  describe\n *  @unknowntag\n *  @type {Object}\n */\nconst a = {};';
        options.allowUnknownTags = true;
        jsdocx.parse(options)
            .then(docs => {
                // below means allowUnknownTags passed the test
                expect(docs).toEqual(jasmine.any(Array));
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('config.tags.allowUnknownTags should override options.allowUnknownTags and throw', done => {
        options.source = '/**\n *  describe\n *  @unknowntag\n *  @type {Object}\n */\nconst a = {};';
        // config.tags should override allowUnknownTags
        options.config.tags = {
            allowUnknownTags: false
        };
        jsdocx.parse(options)
            .catch(err => {
                expect(err).toBeDefined();
            })
            .finally(done);
    });

    it('config.tags.allowUnknownTags should override options.allowUnknownTags and not throw', done => {
        options.source = '/**\n *  describe\n *  @unknowntag\n *  @type {Object}\n */\nconst a = {};';
        options.allowUnknownTags = false;
        // config.tags should override allowUnknownTags
        options.config.tags = {
            allowUnknownTags: true
        };
        jsdocx.parse(options)
            .then(docs => {
                // below means allowUnknownTags passed the test
                expect(docs).toEqual(jasmine.any(Array));
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    // allows passing custom options to jsdoc
    it('setting config.custom object should not throw', done => {
        options.source = '/**\n *  describe\n *  @type {Object}\n */\nconst a = {};';
        options.config.custom = {
            key: 'value'
        };
        // an update (keep: true for `tmp`) to allow parsing the config to ensure `custom`
        // is set properly would be helpful in determining if this works as expected
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    // Note that JSDoc currently does not support ES7 async, await, etc..
    // Tests below are for the `plugins` option (using jsdoc-strip-async-await plugin)

    it('should throw on ES7 async', done => {
        options.files = './test/input-conf/async.js';
        jsdocx.parse(options)
            .catch(err => {
                expect(err).toBeDefined();
            })
            .finally(done);
    });

    it('should execute plugin to strip ES7 async', done => {
        options.files = './test/input-conf/async.js';
        options.plugins = [
            'node_modules/jsdoc-strip-async-await'
        ];
        jsdocx.parse(options)
            .then(docs => {
                expect(docs).toEqual(jasmine.any(Array));
            })
            .catch(err => {
                expect(Boolean(err)).toEqual(false);
                console.log(err.stack || err);
            })
            .finally(done);
    });

    it('should throw on invalid source file(s)', () => {
        function throwTest() {
            jsdocx.parse({ files: '' });
        }
        expect(throwTest).toThrow();
    });

});
