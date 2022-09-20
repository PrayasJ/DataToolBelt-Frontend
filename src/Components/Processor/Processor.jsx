import React from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select'
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

import { AiOutlineLeft, AiOutlineRight, AiOutlineArrowRight } from 'react-icons/ai'
import { processTypes } from '../../processType';

import subicon1 from '../../Images/sub-icon-1.svg';
import subicon2 from '../../Images/sub-icon-2.svg';
import subicon3 from '../../Images/sub-icon-3.svg';
import subicon4 from '../../Images/sub-icon-4.svg';

const methodIcons = {
	0: subicon1,
	1: subicon2,
	2: subicon3,
	3: subicon4
}


function Processor(type) {

	const { id, method } = useParams()

	const title = method ? config.getSubTitle(type.type, method) : config.getTitle(type.type)
	document.title = title + ' - DataToolBelt'
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

	const items = 55

	let totalpages = (items % 25) == 0 ? 0 : 1 + Math.floor(items / 25)
	const [columns, setColumns] = useState(getColumns(id))
	const [page, setPage] = useState(1)


	const getTable = (id, page) => {
		Object.keys(columns).forEach((key) => {
			let getData = test[key]
			if (getData !== undefined) columns[key] = getData
		})
	}

	getTable(id, page)

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

	const columnData = Object.keys(columns).map((key) => {
		return columnHelper.accessor(key, {
			header: () => <div className='head'>{key}</div>,
			cell: info => <div className='item'>{info.renderValue()}</div>,
		})
	})

	const [data, setData] = React.useState(() => [...defaultData])

	const table = useReactTable({
		data,
		columns: columnData,
		getCoreRowModel: getCoreRowModel()
	})

	const onPrevPage = () => {
		if (page > 1) {
			setPage(page - 1)
		}
	}

	const onNextPage = () => {
		if (page < totalpages) {
			setPage(page + 1)
		}
	}

	const openSubMethod = (sub) => {
		window.location.href = `/${id}/${type.type}/${sub}`
	}

	const selectStyles = {
		option: (provided, state) => ({
			...provided,
		}),
		control: () => ({
			width: '100%',
			display: 'flex',
		}),
		singleValue: (provided, state) => {
			const opacity = state.isDisabled ? 0.5 : 1;
			const transition = 'opacity 300ms';
	
			return { ...provided, opacity, transition };
		}
	}

	const onTypeSelect = (e) => {
		console.log(e)
	}

	return (
		title && <div className="processor">
			<Sidebar />
			<div className='processor-main'>
				<div className='title-bar'>
					<div className='title noselect'>
						{title}
					</div>
					<div className='task-bar'>
						<div className='task-name noselect'>TASK ID</div>
						<div className='task-id'>#{id}</div>
					</div>
				</div>
				{
					!method && processTypes[type.type].children && 
					<div className='method-block noselect'>
						{Object.keys(processTypes[type.type].children).map((submethod, i) => {
							let subm = processTypes[type.type].children[submethod];
							return (
								<div className='submethod' onClick={() => openSubMethod(submethod)}>
									<img className='sub-icon' src={methodIcons[i]} />
									<div className='sub-title'>
										{subm.title}
									</div>
									<div className='sub-desc'>
										{subm.desc}
									</div>
								</div>
							)
						})}
					</div>
				}

				{
					type.type == 'convert' && 
					<div className='input-block'>
						<div className='input-select'>
							<div className='select-title'>
								Select Datatype
								<Select
									options={config.getSupportedTypes()}
									onChange={onTypeSelect}
									className='selector'
									styles={selectStyles}
									components={{
										IndicatorSeparator: () => null
									}}
								/>
							</div>
						</div>
						<div className='submit-btn'>
							 Start Conversion
							 <AiOutlineArrowRight />
							</div>
					</div>
				}
				<div className='table-block'>
					<div className='title noselect'>
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
					<div className='pages noselect'>
						<div className='page-item'>
							{`${(page - 1) * 25 + 1} - ${Math.min(page * 25, items)} of ${items} items`}
						</div>
						<div className='page-item'>
							{page} of {totalpages} Pages
						</div>
						<div className='page-item page-row'>
							<AiOutlineLeft
								onClick={onPrevPage}
								style={{ visibility: `${page > 1 ? 'visible' : 'hidden'}` }}
							/>
							<div className='page-box'>
								{page}
							</div>
							<AiOutlineRight
								onClick={onNextPage}
								style={{ visibility: `${page < totalpages ? 'visible' : 'hidden'}` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Processor;
