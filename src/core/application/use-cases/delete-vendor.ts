import type { KnexVendorRepository } from "../../../infra/adapters/knex/vendor-repository.js";
import type { VendorUpdate } from "../../domain/entities/Vendor.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class DeleteVendorUseCase {
    constructor(
        private vendorRepository: KnexVendorRepository,
    ) { }

    async execute(vendor: VendorUpdate) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.VENDOR_ID_REQUIRED,
                invalid_type_error: ErrorMessages.VENDOR_ID_REQUIRED
            })
        });

        const result = schema.safeParse(vendor);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const vendorExists = await this.vendorRepository.getById(result.data.id);
        if (!vendorExists) {
            throw new Error(ErrorMessages.VENDOR_NOT_FOUND);
        }

        return await this.vendorRepository.update({ id: result.data.id, status: false });
    }
}
