import React from 'react'
import Select from 'react-select';
import logoFull from '../../Images/logo-full.svg'
import logo from '../../Images/logo.svg'
import './Header.scss'

import { AiOutlineArrowRight, AiOutlineMenu } from "react-icons/ai"
import { RiArrowDropDownLine } from "react-icons/ri"


interface Explore {
	name: string,
	url?: '/',
}

const exploreOptions: Explore[] = [
	{
		name: 'Explore'
	},
	{
		name: 'Explore 2'
	},
	{
		name: 'Explore 3'
	}
]

const onExplore = (e: any) => {
	console.log(e)
}

const customStyles = {
	menu: (provided: any, state: any) => ({
		...provided,
		width: state.selectProps.width,
		borderBottom: '1px dotted pink',
	}),
	option: (provided: any, state: any) => ({
		...provided,
		borderBottom: '1px dotted pink',
		color: '#4FD1C5',
		padding: 20,
	}),
	control: () => ({
		display: 'flex',
		width: '100%'

	}),
	singleValue: (provided: any, state: any) => {
		const opacity = state.isDisabled ? 0.5 : 1;
		const transition = 'opacity 300ms';

		return {
			...provided, opacity, transition,
		};
	}
}

function Header() {
	return (
		<header className='header'>
			<img className='logo full' src={logoFull} />
			<img className='logo small' src={logo} />
			<div className='menu full'>
				<li className='item'>
					Home
				</li>
				<p className='gap'></p>
				<li className='item'>Explore
					<RiArrowDropDownLine
						style={{ 'verticalAlign': 'text-bottom' }}
					/>
					<ul className="dropdown">
						<li><a href="#">Explore</a></li>
						<li><a href="#">Web Design</a></li>
						<li><a href="#">Illustration</a></li>
						<li><a href="#">Iconography</a></li>
					</ul>
				</li>
				<p className='gap'></p>
				<li className='item'>
					About Us
				</li>
				<p className='gap'></p>
				<li className='item white'>
					Get Started
					<AiOutlineArrowRight />
				</li>
				<div id="marker"></div>
			</div>
			<div className='menu small'>
				<div className='item'>
					Menu
					<AiOutlineMenu
						style={{
							'verticalAlign': 'text-bottom',
							'paddingLeft': '12px'
						}}
					/>
				</div>
			</div>
		</header>
	);
}

export default Header
