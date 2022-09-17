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

interface type {
	type: string
}

function Processor(type: type) {

	const { id, method } = useParams()

	const title = method?config.getSubTitle(type.type, method):config.getTitle(type.type)
	if(title == undefined) {
		window.location.href = '/'
	}

	const getColumns = (id: string | undefined):Map<string, Array<number>>  => {
		let c = new Map<string, Array<number>>([])
		testColumns.forEach((type, key) => {
			c.set(key, [])
		})
		return c
}
	const [columns, setColumns] = useState<Map<string, Array<number>>>(getColumns(id))


	const getTable = (id:string | undefined) => {
		columns?.forEach((arr, key) => {
			let getData = test.get(key)
			if(getData !== undefined) columns.set(key, getData)
		})
	}

	getTable(id)


	return (
			title && <div className="processor">
			<Sidebar />
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
						<div className='table'>
							<div className='table-container'>

							</div>
						</div>
					</div>
				</div>
			</div>
	);
}

export default Processor;
