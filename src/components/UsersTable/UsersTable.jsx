import './UsersTable.scss'

import ProgressBar from '../ProgressBar/ProgressBar'

export default function UsersTable() {

    return (
        <div className="users-table">
            <table>
                <thead>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Età</th>
                    <th>Data Iscrizione</th>
                    <th>Stato Abbonamento</th>
                    <th>Obiettivo</th>
                    <th>Var. %</th>
                    <th>Ultimo Update</th>
                </thead>

                <tbody>
                    <tr>
                        <td>1241</td>
                        <td>Domenico Francesco Lupo</td>
                        <td>22 Anni</td>
                        <td>10/03/2024</td>
                        <td className='status'><span className='active'>Attivo 🟢</span></td>
                        <td><ProgressBar progress={70} /></td>
                        <td>+5%</td>
                        <td>2 Settimane fa</td>
                    </tr>
                    <tr>
                        <td>1241</td>
                        <td>Domenico Francesco Lupo</td>
                        <td>22 Anni</td>
                        <td>10/03/2024</td>
                        <td className='status'><span className='expiring'>In Scadenza 🟡</span></td>
                        <td><ProgressBar progress={45} /></td>
                        <td>+5%</td>
                        <td>2 Settimane fa</td>
                    </tr>
                    <tr>
                        <td>1241</td>
                        <td>Domenico Francesco Lupo</td>
                        <td>22 Anni</td>
                        <td>10/03/2024</td>
                        <td className='status'><span className='expired'>Scaduto 🔴</span></td>
                        <td>Obiettivoooo</td>
                        <td>+5%</td>
                        <td>2 Settimane fa</td>
                    </tr>
                    <tr>
                        <td>1241</td>
                        <td>Domenico Francesco Lupo</td>
                        <td>22 Anni</td>
                        <td>10/03/2024</td>
                        <td className='status'><span className='active'>Attivo 🟢</span></td>
                        <td>Obiettivoooo</td>
                        <td>+5%</td>
                        <td>2 Settimane fa</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}