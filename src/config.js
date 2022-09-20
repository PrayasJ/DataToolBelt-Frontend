import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { processTypes } from "./processType"
export const config = {
	getTitle: (key) => {
		let method = processTypes[key]
		if(method === undefined || method.title === undefined) return undefined	
		return method.title
	},

	getSubTitle: (key1, key2) => {
		let method = processTypes[key1]
		if(method === undefined || method.children === undefined) return undefined
		let feature = method.children[key2]
		if(feature === undefined || feature.title === undefined) return undefined
		return feature.title
	},

	getSupportedTypes: () => {
		return [
			{
				value: 'csv',
				label: 'CSV'
			},
			{
				value: 'json',
				label: 'JSON'
			}
		]
	}
}