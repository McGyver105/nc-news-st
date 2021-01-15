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
        describe('GET requests', () => {
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
    })
    describe('/users/:username', () => {
        describe('GET requests', () => {
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
    })
    describe('/articles', () => {
        describe('GET requests', () => {
            it('GET 200 - responds with an array of all articles including comment count', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(12)
                        expect(body.articles[0]).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(String)
                            })
                        )
                })
            })
            it('GET 200 - responds with an array of articles sorted by date by default', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toBeSortedBy('created_at', { descending: true });
                    });
            })
            it('GET 200 - responds with an array of articles sorted by topic', () => {
                return request(app)
                    .get('/api/articles?sorted_by=topic')
                    .expect(200)
                    .then(({ body }) => {
                    expect(body.articles).toBeSortedBy('topic', { descending: true })
                })
            })
            it('GET 400 - responds with a bad request when the sorted by field is invalid', () => {
                return request(app)
                    .get('/api/articles?sorted_by=invalid')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('input field does not exist');
                    });
            });
            it('GET 200 - responds with an array of articles in descending order by default', () => {
                return request(app)
                    .get('/api/articles?sorted_by=votes')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toBeSorted({ descending: true });
                    });
            })
            it('GET 200 - responds with an array of articles in ascending order', () => {
                return request(app)
                    .get('/api/articles?order=asc')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toBeSorted({ ascending: true });
                    });
            })
            it('GET 400 - responds with a bad request when the order field is invalid', () => {
                return request(app)
                    .get('/api/articles?order=invalid')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('input field invalid');
                    });
            })
            it('GET 200 - responds with an array of articles filtered by the author', () => {
                return request(app)
                    .get('/api/articles?author=rogersop')
                    .expect(200)
                    .then(({ body }) => {
                    expect(body.articles).toHaveLength(3)
                })
            })
            it('GET 404 - responds not found when the author has no articles or the author is invalid', () => {
                return request(app)
                    .get('/api/articles?author=invalid')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('no articles found');
                    });
            })
            it('GET 200 - responds with an array filtered by the query topic', () => {
                return request(app)
                    .get('/api/articles?topic=cats')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.articles).toHaveLength(1);
                    });
            });
            it('GET 400 - responds with not found when the topic is invalid or doesnt exist', () => {
                return request(app)
                    .get('/api/articles?topic=dogs')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('no articles found');
                    });
            })
        })
        describe('POST requests', () => {
            it('POST 200 - adds a new article to the database and returns an object on a key of created article', () => {
                return request(app)
                    .post('/api/articles')
                    .send({
                        title: 'new title',
                        body: 'some text',
                        topic: 'mitch',
                        author: 'rogersop',
                    })
                    .expect(201)
                    .then(({ body }) => {
                        expect(typeof body.createdArticle).toBe('object')
                        expect(Array.isArray(body.createdArticle)).toBe(false)
                        expect(body.createdArticle).toEqual(
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
                })
            });
            it('POST 422 - responds with unprocessable when the title is not a string or number', () => {
                return request(app)
                    .post('/api/articles')
                    .send({
                        title: null,
                        body: 'some text',
                        topic: 'mitch',
                        author: 'rogersop',
                    })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            });
            it('POST 422 - responds with unprocessable when the body is not a string or number', () => {
                return request(app)
                    .post('/api/articles')
                    .send({
                        title: 'the title',
                        body: null,
                        topic: 'mitch',
                        author: 'rogersop',
                    })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            });
            it('POST 422 - responds with unprocessable when the topic is invalid', () => {
                return request(app)
                    .post('/api/articles')
                    .send({
                        title: null,
                        body: 'some text',
                        topic: 'invalid topic',
                        author: 'rogersop',
                    })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            });
            it('POST 422 - responds with unprocessable when the author is invalid', () => {
                return request(app)
                    .post('/api/articles')
                    .send({
                        title: null,
                        body: 'some text',
                        topic: 'mitch',
                        author: 'rogersop',
                    })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            });
            it('POST 422 - responds with unprocessable when there is no body attached', () => {
                return request(app)
                    .post('/api/articles')
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            });
            it('POST 500 - responds with server error when an article id is included', () => {
                return request(app)
                    .post('/api/articles/1')
                    .send({
                        title: null,
                        body: 'some text',
                        topic: 'mitch',
                        author: 'rogersop',
                    })
                    .expect(500)
            });
        })
    })
    describe('/articles/:article_id', () => {
        describe('GET requests', () => {
            it('GET 200 - returns an object with all the article information by id when there are comments in the data', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.article).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                article_id: expect.any(Number),
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
        })
        describe('PATCH requests', () => {
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
        })
        describe('DELETE requests', () => {
            it('DELETE 204 - removes articles by id', () => {
                return request(app)
                    .delete('/api/articles/1')
                    .expect(204);
            })
            it('DELETE 404 - responds not found when the id is not present', () => {
                return request(app)
                    .delete('/api/articles/1000')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('article not found');
                    })
            })
            it('DELETE 400 - responds bad request when the article id is invalid', () => {
                return request(app)
                    .delete('/api/articles/notvalid')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            })
        })
    })
    describe('/articles/:article_id/comments', () => {
        describe('POST requests', () => {
            it('POST 200 - returns the posted object with the comment only', () => {
                return request(app)
                    .post('/api/articles/3/comments')
                    .send({ username: 'icellusedkars', body: 'b' })
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.postedComment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                author: expect.any(String),
                                article_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                body: expect.any(String),
                        })
                    )
                })
            })
            it('POST 422 - responds unprocessable when the username does not exist', () => {
                return request(app)
                    .post('/api/articles/1/comments')
                    .send({ username: 'a', body: 'b' })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('input field does not exist');
                    });
            })
            it('POST 422 - responds unprocessable when the article id does not exist', () => {
                return request(app)
                    .post('/api/articles/1000/comments')
                    .send({ username: 'butter_bridge', body: 'a' })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('input field does not exist');
                    });
            })
            it('POST 422 - responds bad request when the body is empty', () => {
                return request(app)
                    .post('/api/articles/2/comments')
                    .send({ username: 'butter_bridge' })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            })
            it('POST 422 - responds bad request when the username is empty', () => {
                return request(app)
                    .post('/api/articles/2/comments')
                    .send({ body: 'a' })
                    .expect(422)
                    .then(({ body }) => {
                        expect(body.msg).toBe('field missing');
                    });
            })
            it('POST 500 - responds with an internal server error when the path is spelt incorrectly', () => {
                return request(app)
                    .post('/api/articles/2/commet')
                    .send({ username: 'butter_bridge', body: 'a' })
                    .expect(500);
            })
        })
        describe('GET requests', () => {
            it('GET 200 - responds with an array of comments for the article id', () => {
                return request(app)
                    .get('/api/articles/5/comments')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toHaveLength(2)
                        expect(Array.isArray(body.comments))
                        expect(body.comments[0]).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String)
                            })
                        )
                    })
            })
            it('GET 200 - responds with an empty array when the article exists but has no comments', () => {
                return request(app)
                    .get('/api/articles/2/comments')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toHaveLength(0)
                    });
            })
            it('GET 404 - responds with not found when the article id is valid but does not exist', () => {
                return request(app)
                    .get('/api/articles/1000/comments')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('article does not exist')
                    })
            })
            it('GET 400 - responds with bad request when the article id is invalid', () => {
                return request(app)
                    .get('/api/articles/notvalid/comments')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            })
            it('GET 200 - responds with an array of comments sorted in ascending order by created_at by default', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toBeSortedBy('created_at', { descending: true });
                    });
            })
            it('GET 200 - responds with an array of comments sorted in descending order by author', () => {
                return request(app)
                    .get('/api/articles/1/comments?sorted_by=author')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toBeSortedBy('author', { descending: true });
                    });
            })
            it('GET 400 - responds with a bad request when sorted by an invalid column', () => {
                return request(app)
                    .get('/api/articles/1/comments?sorted_by=language')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('input field does not exist');
                    });
            })
            it('GET 200 - responds with an array of comments sorted descending by default', () => {
                return request(app)
                    .get('/api/articles/1/comments?sorted_by=votes')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toBeSortedBy('votes', { descending: true });
                    });
            })
            it('GET 200 - responds with an array of comments sorted by votes in ascending order', () => {
                return request(app)
                    .get('/api/articles/1/comments?sorted_by=votes&order=asc')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toBeSortedBy('votes', { ascending: true });
                    });
            })
            it('GET 400 - responds with a bad request when the order is invalid', () => {
                return request(app)
                    .get('/api/articles/1/comments?sorted_by=votes&order=invalid')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid order');
                    });
            })
        })
    })
    describe('/comments/:comment_id', () => {
        describe('PATCH requests', () => {
            it('PATCH 200 - updates the votes count on a comment', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 20 })
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comment.votes).toBe(36);
                        expect(body.comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                author: expect.any(String),
                                article_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                body: expect.any(String)
                            })
                        );
                    });
            });
            it('PATCH 200 - does not change the votes when the vote increment is zero', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 0 })
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comment.votes).toBe(16);
                        expect(body.comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                author: expect.any(String),
                                article_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                body: expect.any(String)
                            })
                        );
                    });
            })
            it('PATCH 404 - responds not found when the comment id is valid but does not exist', () => {
                return request(app)
                    .patch('/api/comments/10000')
                    .send({ inc_votes: 10 })
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('comment not found');
                    });
            });
            it('PATCH 400 - responds bad request when the article id is invalid', () => {
                return request(app)
                    .patch('/api/comments/invalid')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            });
            it('PATCH 400 - responds bad request when the sent body has an invalid value', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 'invalid' })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            });
            it('PATCH 400 - responds bad request when the sent body has an invalid key', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ cni_toves: 20 })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            });
            it('PATCH 400 - responds bad request when the value is falsy', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: false })
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            })
        })
        describe('DELETE requests', () => {
            it('DELETE 204 - responds with no content when a comment is deleted', () => {
                return request(app)
                    .delete('/api/comments/2')
                    .expect(204);
            });
            it('DELETE 404 - responds not found when the comment id is valid but no comment exists', () => {
                return request(app)
                    .delete('/api/comments/10000')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('comment not found');
                    });
            })
            it('DELETE 400 - responds bad request when the comment id is invalid', () => {
                return request(app)
                    .delete('/api/comments/invalid')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('invalid input syntax for type');
                    });
            })
        })
    })
})



