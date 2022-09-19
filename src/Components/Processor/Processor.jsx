import React from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../../config';
import Sidebar from '../Siderbar/Sidebar';
import './Processor.scss';

import { Scrollbars } from 'react-custom-scrollbars-2';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react';
import { test, testColumns } from '../../test_data';


function Processor(type) {

	const { id, method } = useParams()

	const title = method ? config.getSubTitle(type.type, method) : config.getTitle(type.type)
	if (title == undefined) {
		window.location.href = '/'
	}

	const getColumns = (id) => {
		let c = {}
		testColumns.forEach((c2) => {
			c[c2[0]] = {}
		})
		return c
	}
	const [columns, setColumns] = useState(getColumns(id))


	const getTable = (id) => {
		Object.keys(columns).forEach((key) => {
			let getData = test[key]
			if (getData !== undefined) columns[key] = getData
		})
	}

	getTable(id)

	const colCount = test.length
	const rowCount = test['c1'].length
	const defaultData = []
	for (let i = 0; i < rowCount; i++) {
		defaultData.push({})
	}
	Object.keys(columns).forEach((key) => {
		for (let i = 0; i < columns[key].length; i++) {
			defaultData[i][key] = columns[key][i].toString()
		}
	})

	const columnHelper = createColumnHelper()

	const columnData = Object.keys(columns).map((key)=>{
		return columnHelper.accessor(key, {
			header: () => <div className='head'>{key}</div>,
			cell: info => <div className='item'>{info.renderValue()}</div>,
		})
	})

	const [data, setData] = React.useState(() => [...defaultData])

	console.log({data}, typeof(columnData))

	const table = useReactTable({
		data,
		columns: columnData,
		getCoreRowModel: getCoreRowModel()
	})

	return (
		title && <div className="processor">
			<Sidebar />
			<div className='processor-main'>
				<div className='title-bar'>
					<div className='title'>
						{title}
					</div>
					<div className='task-bar'>
						<div className='task-name'>TASK ID</div>
						<div className='task-id'>#{id}</div>
					</div>
				</div>
				<div className='table-block'>
					<div className='title'>
						Table Overview
					</div>
					<div className='table'>
						<Scrollbars 
						className='table-container'>
							<table className='data-table'>
								<thead>
									{table.getHeaderGroups().map(headerGroup => (
										<tr key={headerGroup.id}>
											{headerGroup.headers.map(header => (
												<th key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody>
									{table.getRowModel().rows.map(row => (
										<tr key={row.id}>
											{row.getVisibleCells().map(cell => (
												<td key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</Scrollbars>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Processor;
