import style from './Sidebar.module.scss'

export function Sidebar() {
	return (
		<div className={style.mainer}>
			<div className={style.container}>
				<div className={style.logo}>
					<svg
						width='32'
						height='32'
						viewBox='0 0 32 32'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<rect width='32' height='32' rx='4.32981' fill='white' />
						<g clip-path='url(#clip0_968_274)'>
							<path
								d='M7.08765 8.87012V23.1298H9.10352V10.892H24.9122V8.87012H7.08765Z'
								fill='#E99E36'
							/>
							<path
								d='M20.9867 12.9131H11.2256V14.935H20.9867V12.9131Z'
								fill='#E99E36'
							/>
							<path
								d='M24.9122 21.1084H11.1194V23.1303H24.9122V21.1084Z'
								fill='#E99E36'
							/>
							<path
								d='M22.8963 17.0635H11.1194V19.0854H22.8963V17.0635Z'
								fill='#E99E36'
							/>
						</g>
						<defs>
							<clipPath id='clip0_968_274'>
								<rect
									width='17.8246'
									height='14.2597'
									fill='white'
									transform='translate(7.08765 8.87012)'
								/>
							</clipPath>
						</defs>
					</svg>
				</div>
				<ul className={style.icon_list}>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_282)'>
								<path
									d='M18.4 4.63636H17.6V3H16V4.63636H8V3H6.4V4.63636H5.6C4.72 4.63636 4 5.37273 4 6.27273V19.3636C4 20.2636 4.72 21 5.6 21H18.4C19.28 21 20 20.2636 20 19.3636V6.27273C20 5.37273 19.28 4.63636 18.4 4.63636ZM18.4 19.3636H5.6V8.72727H18.4V19.3636Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_282'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_286)'>
								<path
									d='M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_286'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM14 16H6V14H14V16ZM18 12H6V10H18V12Z'
								fill='white'
							/>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_295)'>
								<path
									d='M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_295'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_299)'>
								<path
									d='M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_299'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_303)'>
								<path
									d='M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_303'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_307)'>
								<path
									d='M11.99 18.54L4.62 12.81L3 14.07L12 21.07L21 14.07L19.37 12.8L11.99 18.54ZM12 16L19.36 10.27L21 9L12 2L3 9L4.63 10.27L12 16Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_307'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_311)'>
								<path
									d='M6 13C3.8 13 2 14.8 2 17C2 19.2 3.8 21 6 21C8.2 21 10 19.2 10 17C10 14.8 8.2 13 6 13ZM12 3C9.8 3 8 4.8 8 7C8 9.2 9.8 11 12 11C14.2 11 16 9.2 16 7C16 4.8 14.2 3 12 3ZM18 13C15.8 13 14 14.8 14 17C14 19.2 15.8 21 18 21C20.2 21 22 19.2 22 17C22 14.8 20.2 13 18 13Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_311'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
					<li>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_968_315)'>
								<path
									d='M20 7H15V4C15 2.9 14.1 2 13 2H11C9.9 2 9 2.9 9 4V7H4C2.9 7 2 7.9 2 9V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V9C22 7.9 21.1 7 20 7ZM9 12C9.83 12 10.5 12.67 10.5 13.5C10.5 14.33 9.83 15 9 15C8.17 15 7.5 14.33 7.5 13.5C7.5 12.67 8.17 12 9 12ZM12 18H6V17.25C6 16.25 8 15.75 9 15.75C10 15.75 12 16.25 12 17.25V18ZM13 9H11V4H13V9ZM18 16.5H14V15H18V16.5ZM18 13.5H14V12H18V13.5Z'
									fill='white'
								/>
							</g>
							<defs>
								<clipPath id='clip0_968_315'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</li>
				</ul>
			</div>
		</div>
	)
}
