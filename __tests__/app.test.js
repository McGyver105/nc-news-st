const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

afterAll(() => {
    connection.destroy()
})

describe('/api', () => {
    describe('/topics', () => {
        it('GET - 200 Returns an array of topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200).then(({body}) => {
                expect(body.topics).toHaveLength(3);
                expect(body.topics[0]).toEqual(
                    expect.objectContaining({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                )
            })
        })
        it('GET - 404 Gives error message for the wrong path', () => {
            return request(app)
            .get('/api/toics')
            .expect(404);
        })
    })
    describe('/users', () => {
        it('GET - 200 - responds with a user object for that id', () => {
            return request(app)
                .get('/api/users/rogersop')
                .expect(200)
                .then(({ body }) => {
                    expect(body.username).toHaveLength(1)
                    expect(body.username[0]).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            avatar_url: expect.any(String),
                            name: expect.any(String)
                        })
                    )
            })
        })
        it('GET - 404 - responds with not found for invalid usernames', () => {
            return request(app)
                .get('/api/users/tickle122')
                .expect(404);
        })
    })
})