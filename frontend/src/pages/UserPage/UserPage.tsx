import { Sidebar } from '../../components/Sidebar'


export function UserPage() {
  // useEffect(() => {
  // 	axios.get('http://localhost:3000/messages', {
  // 		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  // 	})
  // }, [])
  // const { state } = useLocation();
  // const { successfulMailDeliveryText } = state;
  return (
    <div>
      <Sidebar />
    </div>
  );
}
