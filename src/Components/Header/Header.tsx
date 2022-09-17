import React from 'react'
import logoFull from '../../Images/logo-full.svg'
import logo from '../../Images/logo.svg'
import './Header.scss'

import { AiOutlineArrowRight, AiOutlineMenu } from "react-icons/ai" 
import { RiArrowDropDownLine } from "react-icons/ri"

function Header() {
	return (
		<header className='header'>
			<img className='logo full' src={logoFull} />
			<img className='logo small' src={logo} />
			<div className='menu full'>
				<div className='item'>
					Home
				</div>
				<div className='gap'></div>
				<div className='item'>
					Explore 
					<RiArrowDropDownLine 
						style={{'verticalAlign': 'text-bottom'}}
					/>
				</div>
				<div className='gap'></div>
				<div className='item'>
					About Us
				</div>
				<div className='gap'></div>
				<div className='item white'>
					Get Started 
					<AiOutlineArrowRight/>
				</div>
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
