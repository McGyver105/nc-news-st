const { changeTimeStamp, formatDataTimeStamp, createArticlesLookup, formatArticlesData } = require('../db/utils/data-manipulation');
const { lookup } = require('../db/utils/lookuptestobj');

describe('changeTimeStamp', () => {
    describe('Functionalty', () => {
        it('returns a date object from the input number', () => {
            const input = 1471522072389
            expect(typeof changeTimeStamp(input)).toBe('object')
        })
    })
})

describe('formatDataTimeStamp', () => {
    describe('Functionality', () => {
        it('returns array with empty objects with no articles input', () => {
            const input = [];
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual([])
        })
        it('returns the changed key when 1 article is passed', () => {
            const input = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: 1492163783248
            }]
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual([{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: new Date(1492163783248)
            }])
            
        })
        it('returns all the data with the timestamp modified for multiple articles', () => {
            const input = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: 1492163783248
            }, {
                    title: 'The chef',
                    topics: 'writing',
                    author: 'Nate',
                    body: 'good',
                    created_at: 1234567890123,
                }]
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual([{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: new Date(1492163783248)
            },
            {
                title: 'The chef',
                topics: 'writing',
                author: 'Nate',
                body: 'good',
                created_at: new Date(1234567890123),
            }])
        })
    })
    describe('Pure function?', () => {
        it('does not mutate the input', () => {
            const input = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: "Fri Apr 14 2017 10:56:23 GMT+0100 (British Summer Time)"
            }];
            const copyOfInput = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: "Fri Apr 14 2017 10:56:23 GMT+0100 (British Summer Time)"
            }];
            formatDataTimeStamp(input, changeTimeStamp);
            expect(input).toEqual(copyOfInput);
        })
        it('returns an array with a different reference to the input', () => {
            const input = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: "Fri Apr 14 2017 10:56:23 GMT+0100 (British Summer Time)"
            }]
            expect(formatDataTimeStamp(input, changeTimeStamp)).not.toBe(input);
        })
        it('returns the same result every time', () => {
            const input = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: 1492163783248
            }]
            const output = [{
                title: 'The vegan carnivore?',
                topic: 'cooking',
                author: 'tickle122',
                body: 'The chef',
                created_at: new Date(1492163783248)
            }]
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
        })
    })
})

describe('createArticlesLookup', () => {
    describe('functionality', () => {
        it('Returns an object, not an array', () => {
            const input = [];
            expect(createArticlesLookup(input)).toEqual({});
            expect(Array.isArray(createArticlesLookup(input))).toBe(false);
        })
        it('Returns an array with one object with the converted id', () => {
            const input = [{article_id: 1,
                 title: 'title_value',
                    body: 'body',
                    votes: 0,
                    topic: 'topic',
                author: 'author',
            created_at: 123456123456}];
            const output = {title_value: 1};
            expect(createArticlesLookup(input)).toEqual(output);
        })
        it('Returns a lookup object when passed multiple articles', () => {
            const input = [{article_id: 1,
                title: 'title_value',
                   body: 'body',
                   votes: 0,
                   topic: 'topic',
               author: 'author',
           created_at: 123456123456},
                {article_id: 2,
                    title: 'title_value2',
                    body: 'body2',
                    votes: 0,
                    topic: 'topic2',
                author: 'author2',
            created_at: 123456123456}];
       const output = {title_value: 1, title_value2: 2};
       expect(createArticlesLookup(input)).toEqual(output);
        })
    })
    describe('pure function', () => {
        it('Does not mutate the input', () => {
            const input = [{article_id: 1,
                title: 'title_value',
                   body: 'body',
                   votes: 0,
                   topic: 'topic',
               author: 'author',
           created_at: 123456123456}];
           const copyOfInput = [{article_id: 1,
            title: 'title_value',
               body: 'body',
               votes: 0,
               topic: 'topic',
           author: 'author',
       created_at: 123456123456}];
       createArticlesLookup(input);
       expect(input).toEqual(copyOfInput);
        })
    })
})

describe('formatArticlesData', () => {
    describe('Functionality', () => {
        it('returns an array', () => {
            const input = []
            expect(Array.isArray(formatArticlesData(input, lookup))).toBe(true);
        })
        it('returns an array with 1 comment formatted correctly', () => {
            const input = [{
                body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
                belongs_to: 'Making sense of Redux',
                created_by: 'grumpy19',
                votes: 7,
                created_at: 1478813209256,
            }]
            const output = [{
                body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
                article_id: 4,
                author: 'grumpy19',
                votes: 7,
                created_at: new Date(1478813209256),
            }]
            expect(formatArticlesData(input, lookup)).toEqual(output);
        })
        it('returns an array with multiple comments formatted correctly', () => {
            const input = [
            {
                body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
                belongs_to: 'Making sense of Redux',
                created_by: 'grumpy19',
                votes: 7,
                created_at: 1478813209256,
            },
            {
                body: 'This is a comment',
                belongs_to: 'Stone Soup',
                created_by: 'tickle122',
                votes: 2,
                created_at: 9340927408223,
                }]
            const output = [
            {
                body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
                article_id: 4,
                author: 'grumpy19',
                votes: 7,
                created_at: new Date(1478813209256),
            },
            {
                body: 'This is a comment',
                article_id: 35,
                author: 'tickle122',
                votes: 2,
                created_at: new Date(9340927408223),
                }]
            expect(formatArticlesData(input, lookup)).toEqual(output);
        })
    })
})
