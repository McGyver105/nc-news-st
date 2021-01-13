const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

afterAll(() => {
    return connection.destroy()
})

beforeEach(() => {
    return connection.seed.run();
});

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
        it('GET - 500 Gives error message for the wrong path', () => {
            return request(app)
                .get('/api/toics')
                .expect(500);
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
                            comment_count: expect.any(String)
                        })
                    )
                    expect(body.article.comment_count).not.toBe('0');
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
                            comment_count: expect.any(String)
                        })
                    )
                    expect(body.article.comment_count).toBe('0');
                })
        })
        it('GET 404 - returns not found when the article id is valid but not present', () => {
            return request(app)
                .get('/api/articles/1000')
                .expect(404)
                .then(({body})=> {
                    expect(body.msg).toBe('article not found');
            })
        })
        it('GET 400 - returns a bad request when the article id is invalid (article ids must be a number', () => {
            return request(app)
                .get('/api/articles/notanarticle')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('invalid input syntax for type');
            })
        })
        it('PATCH 200 - responds with an object containing the updated article (article 1))', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: 100 })
                .expect(200)
                .then(({body}) => {
                    expect(body.updatedArticle).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.any(String)
                        })
                    )
                    expect(body.updatedArticle.votes).toBe(200)
            })
        })
        it('PATCH 200 - responds with an object containing the updated article (article 2))', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({ inc_votes: 100 })
                .expect(200)
                .then(({body}) => {
                    expect(body.updatedArticle).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            body: expect.any(String),
                            votes: expect.any(Number),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.any(String)
                        })
                    )
                    expect(body.updatedArticle.votes).toBe(100)
            })
        })
        it('PATCH 400 - responds with bad request when the vote change is not a number', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: 'ten'})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('invalid input syntax for type' )
                })
        })
        it('PATCH 404 - responds with not found when the article id is valid but not present', () => {
            return request(app)
                .patch('/api/articles/1020')
                .send({ inc_votes: 100 })
                .expect(404);
        })
        it('PATCH 400 - responds with bad request when the object in the body is badly formatted', () => {
            return request(app)
                .patch('/api/articles/3')
                .send({ cni_steov: 100 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('invalid input syntax for type' )
                })
        })
        it('PATCH 400 - responds with a bad request when the article id is invalid', () => {
            return request(app)
                .patch('/api/articles/notvalid')
                .send({ inc_votes: 100 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('invalid input syntax for type' )
                })
        })
        xdescribe('/:article_id/comments', () => {
            it('POST 200 - returns the posted object with the comment only', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'a', body: 'b' })
                    .expect(200);
            })
        })
    })
})



