import { describe, it } from '@jest/globals'
import * as supertest from 'supertest'
import { object, number, string, array } from 'superstruct'

const request = supertest('https://practice-react.sdetunicorns.com/api/test')


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

    it.only('POST create a new brand', async () => {
        const payload = {
            "name": "test name",
            "description": "test descr"
          }

        const response = await request
            .post('/brands')
            .send(payload)


      console.log('response', response.body)

      const today = new Date()


        
         expect(response.status).toBe(200)
         expect(response.body.name).toBe(payload.name) 
         expect(response.body.description).toBe(payload.description)
         expect(response.body.createdAt).toContain([today.getFullYear, today.getMonth, today.getDate])

    })
})