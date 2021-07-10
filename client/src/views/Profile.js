import {UserContext} from '../contexts/UserContext'
import {useContext, useEffect} from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import ActionButtons from '../components/profile/ActionButtons'
import Toast from 'react-bootstrap/Toast'
import UpdateProfileModal from '../components/users/UpdateUserModal'

const Profile = () => {
	//context
	const {
		authState: {
			user: { username }
		}
	} = useContext(AuthContext)

	const {
		userState : { user, users, usersLoading},
		getProfile,
		showToast: {show, message, type},
		setShowToast
	} = useContext(UserContext)

	// start get users
	useEffect(() => getProfile(), [])
	let body = null
	//checkrole
	//console.log(user.role)
	if (usersLoading) {
		body = (
			<div className='spinner-container'>
				<Spinner animation='border' variant='info' />
			</div>
		)
	} else {
		
		body = (
			<>
            
            <Table striped bordered hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>Mail</th>
                        <th>Username</th>
                        <th>Password</th>
                        {/* <th>Role</th> */}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{users.mail}</td>
                    <td>{users.username}</td>
                    <td>{users.password}</td>
                    
				
                    {/* <td><ActionButtons /></td> */}
                    </tr>
                </tbody>
                </Table>
			</>
		)
	}

	return <>

	{body}
	
	{user !== null && <UpdateProfileModal />}
	<Toast
				show={show}
				style={{ position: 'fixed', top: '20%', right: '10px' }}
				className={`bg-${type} text-white`}
				onClose={setShowToast.bind(this, {
					show: false,
					message: '',
					type: null
				})}
				delay={3000}
				autohide
			>
				<Toast.Body>
					<strong>{message}</strong>
				</Toast.Body>
			</Toast>
	</>
} 

export default Profile
