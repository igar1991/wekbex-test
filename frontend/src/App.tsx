import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { MainPagination } from "./components/Mainpagination";
import Button from "react-bootstrap/Button";

const URL = "http://localhost:3007/api/city";
const LIMIT = 18;

export type City = {
	_id: string;
	title: string;
	date: string;
	amount: number;
	distance: number;

}
export type Columns = "title" | "amount" | "distance";

export type Sort ={
	sort: Columns;
	value: boolean;
};

export interface Page {
	data: City[];
	next?: number;
	previous?: number;
	rowsPerPage: number;
	totalCities: number;
	totalPages: number;
}

function App() {
	const [page, setPage] = useState<number>(1);
	const [data, setData] = useState<Page | null>(null);
	const [currentSort, setCurrentSort] = useState<Sort>({sort:"title", value: true});

	useEffect(() => {
		(async () => {
			try {
				const data = await fetch(`${URL}?page=${page-1}&limit=${LIMIT}&sort=${currentSort.sort}&value=${currentSort.value ? 1 : -1}`);
				const result = await data.json();
				setData(result.data);
				console.log(result);
			} catch(e){
				console.log(e);
			}
		}
		)();
	}, [page, currentSort]);

	const changePage = (value: number): void=>{
		setPage(value);
	};

	const changeSort=(column: Columns): void=>{
		setCurrentSort(prev=>{
			if(prev.sort === column) return {...prev, value:!prev.value };
			return {sort: column, value: true};
		});
	};

	return (
		<div className="container">
			<h1 className="m-3">
				WelbeX
			</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th className="col-3">Дата</th>
						<th className="col-3">Название<Button variant="outline-primary rounded-circle ms-3" onClick={()=>changeSort("title")}>↑↓</Button></th>
						<th className="col-3">Количество<Button variant="outline-primary rounded-circle ms-3" onClick={()=>changeSort("amount")}>↑↓</Button></th>
						<th className="col-3">Расстояние<Button variant="outline-primary rounded-circle ms-3" onClick={()=>changeSort("distance")}>↑↓</Button></th>
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
				totalPages={data?.totalPages||0}
				changePage={changePage}
			/>
		</div>
	);
}

export default App;
