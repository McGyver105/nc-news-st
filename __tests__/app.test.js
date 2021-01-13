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
                    expect(body.user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            avatar_url: expect.any(String),
                            name: expect.any(String)
                        })
                    )
            })
        })
        it('GET - 404 - responds with not found for non-existant usernames', () => {
            return request(app)
                .get('/api/users/tickle122')
                .expect(404);
        })
        it('GET - 400 - responds with a bad request for invalid usernames (usernames must have letters and/or numbers)', () => {
            return request(app)
                .get('/api/users/123456')
                .expect(400);
        })
    })
    describe('/articles', () => {
        it('GET 200 - returns an object with all the article information by id when there are comments in the data', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            body: expect.any(String),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        })
                    )
                    expect(body.article).toEqual(
                        expect.objectContaining({
                            comment_count: expect.any(Number)
                        })
                    )
                    expect(body.article.comment_count).not.toBe(0);
                })
        })
        it('GET 200 - returns an object with all the article information by id when there are no comments in the data', () => {
            return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            body: expect.any(String),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        })
                    )
                    expect(body.article).toEqual(
                        expect.objectContaining({
                            comment_count: expect.any(Number)
                        })
                    )
                    expect(body.article.comment_count).toBe(0);
                })
        })
        it('GET 404 - returns not found when the article id is valid but no present', () => {
            return request(app)
                .get('/api/articles/1000')
                .expect(404);
        })
        it('GET 400 - returns a bad request when the article id is invalid (article ids must be a number', () => {
            return request(app)
                .get('/api/articles/notanarticle')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('invalid username');
            })
        })
    })
})



