class PaginationService {
	#makePagination({ base_url, limit, skip }, total) {
		const hasQueryParams = base_url.split("?");

		if (hasQueryParams.length > 1) {
			const next = skip + limit;
			const nextPage =
      next < total ? `${base_url}&limit=${limit}&skip=${next}` : null;

			const previous = skip - limit < 0 ? null : skip - limit;
			const previuousPage =
      previous != null ? `${base_url}&limit=${limit}&skip=${previous}` : null;

			return { previuousPage, nextPage };
		}

		const next = skip + limit;
		const nextPage =
    next < total ? `${base_url}?limit=${limit}&skip=${next}` : null;

		const previous = skip - limit < 0 ? null : skip - limit;
		const previuousPage =
    previous != null ? `${base_url}?limit=${limit}&skip=${previous}` : null;

		return { previuousPage, nextPage };

	}

	pagination(items, total, options) {
		let { previuousPage, nextPage } = this.#makePagination(options, total);

		return {
			items,
			meta: {
				totalItems: total,
				itemCount: items.length,
				itensPorPage: options.limit,
				totalPages: ((total / options.limit) % 2) % 1 !== 0 ? Math.round(total / options.limit + 1) : total / options.limit + 1,
				currentPage: options.skip / options.limit + 1,
				previuousPage,
				nextPage,
			},
		};
	}
}

module.exports = new PaginationService;