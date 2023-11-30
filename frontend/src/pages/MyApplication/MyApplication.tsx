import { Drawer } from '../../components/Drawer';
import { Header } from '../../components/Header';

export function MyApplication() {
	// useEffect(() => {
	// 	axios.get('http://localhost:3000/messages', {
	// 		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
	// 	})
	// }, [])
	// const { state } = useLocation();
	// const { successfulMailDeliveryText } = state;
	return (
		<div>
			<Drawer PageID={3} />
			<Header />
			<div>
			</div>
		</div>
	);
}
