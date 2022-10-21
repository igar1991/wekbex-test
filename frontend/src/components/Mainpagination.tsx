import React from "react";
import Pagination from "react-bootstrap/Pagination";

export type MainPaginationProps = {
    page: number,
    total: number,
    totalPages: number,
    changePage: (value: number) => void,
}

export const MainPagination = ({ page, total, totalPages, changePage}: MainPaginationProps) => {
	const positions = Array.from({ length: totalPages }, (v, i) => i);
	const between = 3;
	const showPages = 7;
	const ellipsis = 1;
	const range = (
		totalPages <= showPages
		// Show active without slice
			? positions
			: page - 1 <= between
			// Show active in left
				? positions.slice(0, showPages - (ellipsis + 1))
				: page + between >= totalPages
				// Show active in right
					? positions.slice(totalPages - showPages + (ellipsis + 1), totalPages)
				// Show active in middle
					: positions.slice((page - 1) - (between - (ellipsis + 1)), page + (between - (ellipsis + 1)))
	);
	return (
		total > 0
			? <Pagination className="justify-content-md-center">
				<Pagination.Prev onClick={() => page > 1 ? changePage(page - 1) : {}} disabled={page <= 1} />
				{totalPages > showPages && ellipsis > 0 && positions.slice(0, page - 1 <= between ? 0 : ellipsis).map(value => {
					return <Pagination.Item key={value} onClick={() => value !== page - 1 ? changePage(value + 1) : {}}>
						{value + 1}
					</Pagination.Item>;
				})
				}
				{
					// Show ellipsis when "page" is bigger than "between"
					totalPages > showPages && ellipsis > 0 && page - 1 > between
                    && <Pagination.Ellipsis disabled />
				}
				{range.map(value => {
					return <Pagination.Item active={value === page - 1}
						key={value}
						onClick={() => value !== page - 1 ? changePage(value + 1) : {}}>
						{value + 1}
					</Pagination.Item>;
				})}
				{
					// Show ellipsis when "page" is lower than "between"
					totalPages > showPages && page < totalPages - between
                    && <Pagination.Ellipsis disabled />
				}
				{
					totalPages > showPages && positions.slice(page >= totalPages - between ? totalPages : totalPages - ellipsis, totalPages).map(value => { 
						return <Pagination.Item key={value} onClick={() => value !== page - 1 ? changePage(value + 1) : {}}>
							{value + 1}
						</Pagination.Item>; })
				}
				<Pagination.Next onClick={() => page < totalPages ? changePage(page + 1) : {}} disabled={page >= totalPages} />
			</Pagination>
			: <></>
	);
};