import type { KnexVendorRepository } from "../../../infra/adapters/knex/vendor-repository.js";
import type { Vendor } from "../../domain/entities/Vendor.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class CreateVendorUseCase {
    constructor(
        private vendorRepository: KnexVendorRepository
    ) { }

    async execute(vendor: Vendor) {
        const schema = z.object({
            name: z.string({ message: ErrorMessages.VENDOR_NAME_REQUIRED })
                .min(1, ErrorMessages.VENDOR_NAME_REQUIRED),
            email: z.string({ message: ErrorMessages.VENDOR_EMAIL_REQUIRED })
                .min(1, ErrorMessages.VENDOR_EMAIL_REQUIRED)
                .email(ErrorMessages.VENDOR_EMAIL_INVALID),
            document: z.string({ message: ErrorMessages.VENDOR_DOCUMENT_REQUIRED })
                .min(1, ErrorMessages.VENDOR_DOCUMENT_REQUIRED),
            phone: z.string({ message: ErrorMessages.VENDOR_PHONE_REQUIRED })
                .min(1, ErrorMessages.VENDOR_PHONE_REQUIRED),
        });

        const result = schema.safeParse(vendor);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const vendorExists = await this.vendorRepository.getByEmail(result.data.email, vendor.company_id);
        if (vendorExists) {
            throw new Error(ErrorMessages.VENDOR_ALREADY_EXISTS);
        }

        return await this.vendorRepository.create(vendor);
    }
}
