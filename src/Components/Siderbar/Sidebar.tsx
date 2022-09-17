import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Sidebar.scss';

import logoFull from '../../Images/logo-full-white.svg'
import logo from '../../Images/logo-white.svg'

import { RiArrowDropDownLine } from "react-icons/ri"

import { Scrollbars } from 'react-custom-scrollbars-2';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { testColumns } from '../../test_data';

type Data = {
	title: any
	type: any
	value: any
}

const defaultData: Data[] = []

testColumns.forEach((type, key) => {
	defaultData.push({
		title: key,
		type: type,
		value: 'N/a'
	})
})

const columnHelper = createColumnHelper<Data>()

const columns = [
	columnHelper.accessor('title', {
		header: () => <div className='head'>Title</div>,
		cell: info => <div className='item'>{info.renderValue()}</div>,
	}),
	columnHelper.accessor('type', {
		header: () => <div className='head'>Type</div>,
		cell: info => <div className='item'>{info.renderValue()}</div>,
	}),
	columnHelper.accessor(row => row.value, {
		id: 'lastName',
		cell: info => <div className='item'>{info.renderValue()}</div>,
		header: () => <div className='head'>
			Avg
			<RiArrowDropDownLine />
		</div>,
	}),
]

function Sidebar() {

	const [data, setData] = React.useState(() => [...defaultData])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<header className='sidebar'>
			<Link to={'/'}>
				<img className='logo full' src={logoFull} />
				<img className='logo small' src={logo} />
			</Link>
			<div className='info-container'>
				<div className='title'>File Name</div>
				<div className='info'>xyz.csv</div>
				<div className='title'>File Details</div>
				<div className='info-container2'>
					<div className='info-block'>
						<div className='title2'>Size</div>
						<div className='info2'>582Kb</div>
					</div>
					<div className='info-block'>
						<div className='title2'>Date</div>
						<div className='info2'>24/11/2021</div>
					</div>
					<div className='info-block'>
						<div className='title2'>Row Count</div>
						<div className='info2'>1890</div>
					</div>
					<div className='info-block'>
						<div className='title2'>Coloumn Count</div>
						<div className='info2'>24</div>
					</div>
				</div>
				<div className='table'>
					<Scrollbars className='table-container'

					>
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
		</header>
	);
}

export default Sidebar;
