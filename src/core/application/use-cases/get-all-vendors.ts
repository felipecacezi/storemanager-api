import type { KnexVendorRepository } from "../../../infra/adapters/knex/vendor-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetAllVendorsUseCase {
    constructor(
        private vendorRepository: KnexVendorRepository
    ) { }

    async execute(params: { page?: number | undefined, limit?: number | undefined, company_id: number, search?: string | undefined }) {
        const schema = z.object({
            page: z.number({
                required_error: ErrorMessages.VENDOR_PAGE_REQUIRED,
                invalid_type_error: ErrorMessages.VENDOR_PAGE_INVALID,
            })
                .min(1, ErrorMessages.VENDOR_PAGE_REQUIRED)
                .max(50, ErrorMessages.VENDOR_PAGE_MAX)
                .default(1),
            limit: z.number({
                required_error: ErrorMessages.VENDOR_LIMIT_REQUIRED,
                invalid_type_error: ErrorMessages.VENDOR_LIMIT_INVALID,
            })
                .min(1, ErrorMessages.VENDOR_LIMIT_REQUIRED)
                .max(100, ErrorMessages.VENDOR_LIMIT_MAX)
                .default(10),
            search: z.string().optional(),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const { page, limit, search } = result.data;
        const vendors = await this.vendorRepository.getAll(page, limit, params.company_id, search);
        return vendors;
    }
}
