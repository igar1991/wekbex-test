export type City = {
	_id: string;
	title: string;
	date: string;
	amount: number;
	distance: number;

}
export type Columns = "title" | "amount" | "distance";
export type Condition = "$regex" | "$eq" | "$gt" | "$lt";

export interface Sort {
	sort: Columns;
	value: boolean;
}

export interface Page {
	data: City[];
	next?: number;
	previous?: number;
	rowsPerPage: number;
	totalCities: number;
	totalPages: number;
}

export interface Filter {
	column: Columns;
	condition: Condition;
}