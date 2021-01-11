const { changeTimeStamp, formatDataTimeStamp } = require('../db/utils/data-manipulation');

describe('changeTimeStamp', () => {
    describe('Functionalty', () => {
        it('returns a date from the input number', () => {
            const input = 1471522072389
            expect(changeTimeStamp(input)).toBe(new Date(input))
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
                created_at: "Fri Apr 14 2017 10:56:23 GMT+0100 (British Summer Time)"
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
                created_at: "Fri Apr 14 2017 10:56:23 GMT+0100 (British Summer Time)"
            },
            {
                title: 'The chef',
                topics: 'writing',
                author: 'Nate',
                body: 'good',
                created_at: "Fri Feb 13 2009 23:31:30 GMT+0000 (Greenwich Mean Time)",
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
                created_at: "Fri Apr 14 2017 10:56:23 GMT+0100 (British Summer Time)"
            }]
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
            expect(formatDataTimeStamp(input, changeTimeStamp)).toEqual(output)
        })
    })
})