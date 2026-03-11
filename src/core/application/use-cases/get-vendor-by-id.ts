import type { KnexVendorRepository } from "../../../infra/adapters/knex/vendor-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetVendorByIdUseCase {
    constructor(
        private vendorRepository: KnexVendorRepository
    ) { }

    async execute(params: { id: number, company_id: number }) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.VENDOR_ID_REQUIRED,
            }),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const vendor = await this.vendorRepository.getById(result.data.id, params.company_id);
        if (!vendor) {
            throw new Error(ErrorMessages.VENDOR_NOT_FOUND);
        }

        return vendor;
    }
}
