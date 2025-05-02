import { describe, it } from '@jest/globals'
import * as supertest from 'supertest'
import { object, number, string, array } from 'superstruct'

const request = supertest('https://practice-react.sdetunicorns.com/api/test')
let brandId;
const today = new Date()
const getTime = today.getTime()

describe('brands', ()=> {
    it('GET brands', async () => {
        const response = await request.get('/brands')

        console.log('response', response.body)

        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThan(1)

        const hasNameAndIdProperties = response.body.every(el => {
            return '_id' in el && 'name' in el
        })

        expect(hasNameAndIdProperties).toBeTruthy()
        const objectKeys = Object.keys(response.body[0])

        console.log('object keys', objectKeys)
        expect(objectKeys).toEqual(['_id','name'])
    })

    it('GET brand/:id', async () => {
        const response = await request.get('/brands/64b7d25549e85607248e2a9d')
        console.log('response', response.body)

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("A Plus 6811")
    })

    it('POST create a new brand', async () => {
        const payload = {
            "name": 'test name'+ Math.floor(Math.random() *1000),
            "description": "test description"
          }

        const response = await request
            .post('/brands')
            .send(payload)


      console.log('response', response.body)


        brandId = response.body['_id']
        console.log('brandId ', brandId)
        
         expect(response.status).toBe(200)
         expect(response.body.name).toBe(payload.name) 
         expect(response.body.description).toBe(payload.description)
         expect(response.body).toHaveProperty('createdAt') 

         expect(response.body.createdAt).toContain(today.getFullYear().toString())
         expect(response.body.createdAt).toContain(today.getDate().toString().padStart(2, '0'))

    })

    it('PUT update brand information', async () => {

        const payload = {
            "name": `new name ${getTime}`        
          }

          console.log('brandId in PUT request', brandId)
          console.log('payload', payload)
        const response = await request.put(`/brands/${brandId}`).send(payload)

        expect(response.status).toBe(200)
        console.log('response', response.body)
    
        expect(response.body.name).toBe(payload.name)
    })

    it('DELETE brand', async () => {

        const response = await request.delete(`/brands/${brandId}`)

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(null)
    })
})