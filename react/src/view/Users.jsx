import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import Pagination from "react-js-pagination";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    const [ pages, setPages ] = useState({
        total: null,
        current_page: 1,
        per_page: null,
    });

    useEffect(() => {
        getUsers();
    }, [])

    const onDelete = (u) => {
        if(!window.confirm("Are you sure you want to delete this user?")) {
            return
        }

        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                setNotification("User was saccessfully deleted");
                getUsers()
            })
    }

    const getUsers = (pageNumber=1) => {
        console.log(pageNumber);
        setLoading(true)
        axiosClient.get(`/users?page=${pageNumber}`)
            .then(({data}) => {
                setPages(data.meta);
                setLoading(false);
                console.log(data);
                setUsers(data.data);

            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    </tbody>
                    }
                    {!loading && <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.created_at}</td>
                                <td>
                                    <Link to={'/users/'+u.id} className="btn-edit">Edit</Link>
                                    &nbsp;
                                    <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>}
                </table>
                <div>
                <Pagination
                    activePage={pages.current_page}
                    totalItemsCount={pages.total}
                    itemsCountPerPage={pages.per_page}
                    onChange={ev => getUsers(ev)}
                    itemClass="page-item"
                    linkClass="page-link"
                    firstPageText="First"
                    lastPageText="last"
                />
                </div>
            </div>
        </div>
    )
}