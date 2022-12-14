import { processTypes } from "./processType"

let _index = process.env.NODE_ENV == "production" ? 1:0
let baseUrl = [
	'http://192.168.29.18:5000/',
	'https://prayasj.pythonanywhere.com/'
][_index]

export const config = {
	bytesToHuman: (size) => {
		let i = Math.floor(Math.log(size) / Math.log(1024))
		return Number((size / Math.pow(1024, i)).toFixed(2)).toString() + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	  },
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
			},
			{
				value: 'xml',
				label: 'XML'
			}
		]
	},

	getNullValueOperations: () => {
		return [
			{
				value: 'drop',
				label: 'Drop',
			},
			{
				value: 'Average',
				label: 'Average',
			},
			{
				value: 'Maximum',
				label: 'Maximum',
			},
			{
				value: 'Minimum',
				label: 'Minimum',
			},
		]
	},
	
	routes: {
		upload: baseUrl + 'uploader',
		fetch: baseUrl + 'fetch',
		get: baseUrl + 'get',
		function: baseUrl + 'function',
		updateCell: baseUrl + 'update-cell',
		updateHead: baseUrl + 'update-head',
		delRow: baseUrl + 'del-row',
		delCol: baseUrl + 'del-col',
	}
}