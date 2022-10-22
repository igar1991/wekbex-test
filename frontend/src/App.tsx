import React, { useEffect, useState } from "react";
import { MainPagination } from "./components/Mainpagination";
import { Button, Table, Form } from "react-bootstrap";

const URL = "http://localhost:3007/api/city";
const LIMIT = 15;

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

function App() {
	const [page, setPage] = useState<number>(1);
	const [data, setData] = useState<Page | null>(null);
	const [currentSort, setCurrentSort] = useState<Sort>({ sort: "title", value: true });
	const [currentFilter, setCurrentFilter] = useState<Filter>({ column: "title", condition: "$regex" });
	const [valueInput, setValueInput] = useState<string>("");
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [isValidField, setIsValidField] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			try {
				
				const sort = currentSort.sort;
				const value = currentSort.value ? 1 : -1;
				const filter = currentFilter.column;
				const condition = currentFilter.condition;
				const valueEncode = encodeURI(valueInput);
				const data = await fetch(`${URL}?page=${page - 1}&limit=${LIMIT}&sort=${sort}&value=${value}&filter=${filter}&condition=${condition}&valuefilter=${valueEncode}`);
				const result = await data.json();
				setData(result.data);
				console.log(result);
			} catch (e) {
				console.log(e);
			}
		}
		)();
	}, [page, currentSort, isSearch]);

	const changePage = (value: number): void => {
		setPage(value);
	};

	const changeSort = (column: Columns): void => {
		setCurrentSort(prev => {
			if (prev.sort === column) return { ...prev, value: !prev.value };
			return { sort: column, value: true };
		});
	};

	const chooseColumn = (value: Columns) => {
		setCurrentFilter(prev => {
			//validation selects
			let currentConditional:Condition;
			if(value === "title"){
				currentConditional="$regex";
			} else if(prev.condition === "$regex") {
				currentConditional ="$eq";
			} else {
				currentConditional = prev.condition;
			}
			return { condition: currentConditional, column: value };
		}
		);
	};

	const chooseCondition = (value: Condition) => {
		setCurrentFilter(prev => ({ ...prev, condition: value }));
	};

	const getFilterData=(filter: Filter, valueInput:string )=>{
		if(filter.column!=="title" && isNaN(+valueInput)){
			setIsValidField(false);
			return;
		}
		setPage(1);
		setIsSearch(prev=>!prev);
	};


	return (
		<div className="container">
			<h1 className="m-3">
				WelbeX
			</h1>
			<div className="m-5">
				<div className="d-flex gap-3">
					<Form.Select value={currentFilter.column} onChange={(e) => chooseColumn(e.target.value as Columns)}>
						<option value="title">Название</option>
						<option value="amount">Количество</option>
						<option value="distance">Расстояние</option>
					</Form.Select>
					<Form.Select value={currentFilter.condition} onChange={(e) => chooseCondition(e.target.value as Condition)}>
						<option disabled={!(currentFilter.column === "title")} value="$regex">Содержать</option>
						<option disabled={currentFilter.column === "title"} value="$eq">Равно</option>
						<option disabled={currentFilter.column === "title"} value="$gt">Больше</option>
						<option disabled={currentFilter.column === "title"} value="$lt">Меньше</option>
					</Form.Select>
					<Form.Control
						value={valueInput}
						onChange={(e) => setValueInput(e.target.value as string)}
						onFocus={()=>setIsValidField(true)}
						required
						type="text"
					/>
					<Button variant="success" onClick={()=>getFilterData(currentFilter, valueInput)}>Найти</Button>
				</div>
				{!isValidField && <p className="fw-lighter text-danger text-end">Для сравнения необходимо ввести число!</p>}
			</div>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th className="col-3">Дата</th>
						<th className="col-3">Название<Button variant="outline-primary rounded-circle ms-3" onClick={() => changeSort("title")}>↑↓</Button></th>
						<th className="col-3">Количество<Button variant="outline-primary rounded-circle ms-3" onClick={() => changeSort("amount")}>↑↓</Button></th>
						<th className="col-3">Расстояние<Button variant="outline-primary rounded-circle ms-3" onClick={() => changeSort("distance")}>↑↓</Button></th>
					</tr>
				</thead>
				<tbody>
					{data?.data.map(city => {
						return (<tr key={city._id}>
							<td>{city.date.slice(0, 19).replace("T", " ")}</td>
							<td>{city.title}</td>
							<td>{city.amount}</td>
							<td>{city.distance}</td>
						</tr>);
					})}
				</tbody>
			</Table>
			<MainPagination
				page={page}
				total={data?.totalCities || 0}
				totalPages={data?.totalPages || 0}
				changePage={changePage}
			/>
		</div>
	);
}

export default App;
