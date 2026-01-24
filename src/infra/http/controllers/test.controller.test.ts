import { expect } from "chai";
import app from "../app.js";
import { describe, it } from "node:test";

describe('Teste de teste rsrs', () => {
    it('Deve retornar 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/test'
        })
        expect(response.statusCode).to.equal(200)
    })
})