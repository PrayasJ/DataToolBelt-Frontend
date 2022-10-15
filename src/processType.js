export const processTypes = {
	'cleaning': {
		title: 'Data Cleaning',
		desc: 'Data Cleaning processes such as Normalization, Outlier Removal and Null Value Handling.',
		children: {
			'normalization': {
				title: 'Data Normalization',
				desc: 'Normalize all your selected data in for a given range.'
			},
			'outlier': {
				title: 'Outlier Handling',
				desc: 'Rows containing range of selected outlier value will be edited.'
			},
			'null-value': {
				title: 'Null Value Handling',
				desc: 'Compare all Null values either you can remove or replace.'
			}
		}
	},
	'visualization': {
		title: 'Data Visualization',
		desc: 'Data Visualization processes such as Columnwise Representation, Heatmap Creation and Column Comparison.',
		children: {
			'columnwise' : {
				title: 'Columnwise Representation',
				desc: 'Provide all your selected data in multiple interactive graphs.'
			},
			'heatmap' : {
				title: 'Heatmap Creation',
				desc: 'Compare all your selected data in interactive Heatmap Graph.'
			},
			'column-comparison': {
				title: 'Column Comparison',
				desc: 'Compare all your selected data in multiple interactive graphs.'
			}
		}
	},
	'processing': {
		title: 'Data Processing',
		desc: 'Data Processing Methods such as Feature Creation, Data Classification, Feature Reduction and Clustering.',
		children: {
			'feature-creation' : {
				title: 'Feature Creation',
				desc: 'Generate a new field with some specific operations on selected columns.'
			},
			'classification' : {
				title: 'Classification',
				desc: 'Compare all your selected data in interactive Heatmap Graph.'
			},
			'feature-reduction': {
				title: 'Feature Reduction',
				desc: 'Generate a new field with some specific operations on selected columns.'
			},
			'clustering': {
				title: 'Clustering',
				desc: 'Generate a graph for a specific algorithm performed on selected columns.'
			}
		}
	},
	'convert': {
		title: 'Data Conversion',
		children: {},
		desc: 'Data Conversion Methods to convert and download the data.',
	}
}