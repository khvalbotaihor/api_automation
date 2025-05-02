import { describe, it } from '@jest/globals'
import * as supertest from 'supertest'
import { object, number, string, array } from 'superstruct'

const request = supertest('https://jsonplaceholder.typicode.com/')

// Define the schema for a single post
const PostSchema = object({
    userId: number(),
    id: number(),
    title: string(),
    body: string()
})

// Define the schema for the array of posts
const PostsSchema = array(PostSchema)

describe('POC Tests', () => {
    describe('GET', () => {
        it('GET /posts should return valid posts data', async () => {
            const response = await request.get('/posts')
            console.log('Response status:', response.status)
    
            expect(response.body[0].id).toBe(1)
            
            // Validate the response body against the schema
            const validationResult = PostsSchema.validate(response.body)
            
            if (validationResult[0]) {
                console.error('Validation errors:', validationResult[0])
                throw new Error('Response data does not match expected schema')
            }
            
            console.log('Response data is valid according to schema')
            console.log('Number of posts:', response.body.length)
        })

        it('GET /posts with query parameters', async () => {
            const response = await request.get('/posts')
                .query({ userId: 1 })
            
            expect(response.status).toBe(200)
            expect(response.body.every((post: any) => post.userId === 1)).toBe(true)
            console.log('Filtered posts count:', response.body.length)
        })

        it('GET /posts/:id should return specific post', async () => {
            const response = await request.get('/posts/1')
            
            expect(response.status).toBe(200)
            expect(response.body.id).toBe(1)
            console.log('Post details:', response.body)
        })

        it('GET /comments with pagination', async () => {
            const response = await request.get('/comments')
                .query({ postId: 1, _limit: 2 })
            
            expect(response.status).toBe(200)
            expect(response.body.length).toBeLessThanOrEqual(2)
            console.log('Paginated comments:', response.body)
        })
    })

    describe('POST', () => {
        const newPost = {
            title: 'Test Post Title',
            body: 'Test Post Body',
            userId: 1
        }

        it('POST /posts should create new post', async () => {
            const response = await request
                .post('/posts')
                .send(newPost)
            
            expect(response.status).toBe(201)
            expect(response.body.title).toBe(newPost.title)
            expect(response.body.body).toBe(newPost.body)
            expect(response.body.userId).toBe(newPost.userId)
            console.log('Created post:', response.body)
        })

        it('POST /posts with invalid data should fail', async () => {
            const response = await request
                .post('/posts')
                .send({}) // Empty object
            
            expect(response.status).toBe(400)
            console.log('Error response:', response.body)
        })
    })

    describe('PUT', () => {
        const updatedPost = {
            title: 'Updated Post Title',
            body: 'Updated Post Body',
            userId: 5
        }

        it('PUT /posts/:id should update post', async () => {
            const response = await request
                .put('/posts/1')
                .send(updatedPost)
            
            expect(response.status).toBe(200)
            expect(response.body.title).toBe(updatedPost.title)
            expect(response.body.body).toBe(updatedPost.body)
            expect(response.body.userId).toBe(updatedPost.userId)
            console.log('Updated post:', response.body)
        })

        it('PUT /posts/:id with non-existent id should fail', async () => {
            const response = await request
                .put('/posts/999999')
                .send(updatedPost)
            
            expect(response.status).toBe(404)
            console.log('Error response:', response.body)
        })
    })

    describe('DELETE', () => {
        it('DELETE /posts/:id should delete post', async () => {
            const response = await request.delete('/posts/1')
            
            expect(response.status).toBe(200)
            console.log('Delete response:', response.body)
        })

        it('DELETE /posts/:id with non-existent id should fail', async () => {
            const response = await request.delete('/posts/999999')
            
            expect(response.status).toBe(404)
            console.log('Error response:', response.body)
        })
    })

    describe('PATCH', () => {
        it('PATCH /posts/:id should partially update post', async () => {
            const partialUpdate = {
                title: 'Partially Updated Title'
            }
            
            const response = await request
                .patch('/posts/1')
                .send(partialUpdate)
            
            expect(response.status).toBe(200)
            expect(response.body.title).toBe(partialUpdate.title)
            console.log('Partially updated post:', response.body)
        })
    })
})