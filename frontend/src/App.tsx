import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { MainPagination } from "./components/Mainpagination";

const URL = "http://localhost:3007/api/city";
const LIMIT = 18;

export type City = {
	_id: string;
	title: string;
	date: string;
	amount: number;
	distance: number;

}

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
	const [isLoading, setIsloading] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			try {
				setIsloading(true);
				const data = await fetch(`${URL}?page=${page-1}&limit=${LIMIT}`);
				const result = await data.json();
				setData(result.data);
				console.log(result);
				setIsloading(false);
			} catch(e){
				console.log(e);
			} finally{
				setIsloading(false);
			}
		}
		)();
	}, [page]);

	const changePage = async(value: number)=>{
		setPage(value);
	};

	return (
		<div className="container">
			<h1 className="m-3">
				WelbeX
			</h1>
			{!isLoading ? <Table striped bordered hover>
				<thead>
					<tr>
						<th>Дата</th>
						<th>Название</th>
						<th>Количество</th>
						<th>Расстояние</th>
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
			</Table>: <h1>loading</h1>}
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
