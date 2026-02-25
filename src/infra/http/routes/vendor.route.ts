import type { FastifyInstance } from "fastify";
import { VendorController } from "../controllers/vendor.controller.js";
import { KnexVendorRepository } from "../../adapters/knex/vendor-repository.js";
import { CreateVendorUseCase } from "../../../core/application/use-cases/create-vendor.js";
import { UpdateVendorUseCase } from "../../../core/application/use-cases/update-vendor.js";
import { DeleteVendorUseCase } from "../../../core/application/use-cases/delete-vendor.js";
import { GetAllVendorsUseCase } from "../../../core/application/use-cases/get-all-vendors.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { companyMiddleware } from "../middleware/company-middleware.js";

export async function vendorRoute(app: FastifyInstance) {
    const vendorRepository = new KnexVendorRepository(app.knex);

    const createVendorUseCase = new CreateVendorUseCase(vendorRepository);
    const updateVendorUseCase = new UpdateVendorUseCase(vendorRepository);
    const deleteVendorUseCase = new DeleteVendorUseCase(vendorRepository);
    const getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepository);

    const vendorController = new VendorController(
        createVendorUseCase,
        updateVendorUseCase,
        deleteVendorUseCase,
        getAllVendorsUseCase
    );

    app.addHook('onRequest', authMiddleware);
    app.addHook('onRequest', companyMiddleware);

    app.post('/vendors', async (request, reply) => {
        return await vendorController.create(request, reply);
    });

    app.put('/vendors/:id', async (request, reply) => {
        return await vendorController.update(request, reply);
    });

    app.delete('/vendors/:id', async (request, reply) => {
        return await vendorController.delete(request, reply);
    });

    app.get('/vendors', async (request, reply) => {
        return await vendorController.getAll(request, reply);
    });
}