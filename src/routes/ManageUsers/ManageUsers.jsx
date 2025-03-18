import './ManageUsers.scss';
import { useOutletContext } from 'react-router-dom';
import UsersTable from '../../components/features/UsersTable/UsersTable';

export default function ManageUsers() {
    const { TopBar } = useOutletContext();


    return(
        <div className="manage-users">
            <TopBar title="Gestione Clienti" />
            <UsersTable />
        </div>
    )
}