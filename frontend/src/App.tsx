import React, { useEffect, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { MainPagination } from "./components/mainPagination";
import { LIMIT, URL } from "./constans/constans";
import { Filter, Page, Sort, Columns, Condition } from "./types/types";

function App() {
	const [page, setPage] = useState<number>(1);
	const [data, setData] = useState<Page | null>(null);
	const [currentSort, setCurrentSort] = useState<Sort>({ sort: "title", value: true });
	const [currentFilter, setCurrentFilter] = useState<Filter>({ column: "title", condition: "$regex" });
	const [valueInput, setValueInput] = useState<string>("");
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [isValidField, setIsValidField] = useState<boolean>(true);
	const [isError, setIsError] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			try {
				setIsError(false);
				const sort = currentSort.sort;
				const value = currentSort.value ? 1 : -1;
				const filter = currentFilter.column;
				const condition = currentFilter.condition;
				const valueEncode = encodeURI(valueInput);
				const data = await fetch(`${URL}?page=${page - 1}&limit=${LIMIT}&sort=${sort}&value=${value}&filter=${filter}&condition=${condition}&valuefilter=${valueEncode}`);
				const result = await data.json();
				setData(result.data);
			} catch (e) {
				setIsError(true);
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

	const chooseColumn = (value: Columns): void => {
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

	const chooseCondition = (value: Condition): void => {
		setCurrentFilter(prev => ({ ...prev, condition: value }));
	};

	const getFilterData=(filter: Filter, valueInput:string ): void=>{
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
			{/* If no data */}
			{data?.data.length===0 && <h3 className="text-center text-secondary">Ничего не найдено :(</h3>}
			{/* Error */}
			{isError && <h3 className="text-center text-danger">Что то пошло не так :(</h3>}
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
