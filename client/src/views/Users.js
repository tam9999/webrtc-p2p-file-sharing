import {UserContext} from '../contexts/UserContext'
import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
// import Tooltip from 'react-bootstrap/Tooltip'
import Col from 'react-bootstrap/Col'
import SingleUser from '../components/users/SingleUser'
import AddUserModal from '../components/users/AddUserModal'
import UpdateUserModal from '../components/users/UpdateUserModal'
import addIcon from '../assets/plus-circle-fill.svg'

const Users = () => {
	//context
	const {
		authState: {
			user: { username }
		}
		// getAllUsers
	} = useContext(AuthContext)

	const {
		userState : { user, users, usersLoading},
		getUsers,
		setShowAddUserModal,
		showToast: {show, message, type},
		setShowToast
	} = useContext(UserContext)
	//alert
	
	// start get users
	useEffect(() => getUsers(), [])
	let body = null

	if (usersLoading) {
		body = (
			<div className='spinner-container'>
				<Spinner animation='border' variant='info' />
				
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
			</div>
		)
	} else if (users.length === 0) {
		body = (
			<>
				<Card className='text-center mx-5 my-5'>
					<Card.Header as='h1'>Hi {username}</Card.Header>
					<Card.Body>
						<Card.Title>Welcome to LearnIt</Card.Title>
						<Card.Text>
							Click the button below to track your first skill to learn
						</Card.Text>
						<Button
							variant='primary'
							//onClick={setShowAddPostModal.bind(this, true)}
						>
							LearnIt!
						</Button>
					</Card.Body>
				</Card>
			</>
		)
	} else {
		body = (
			<>
				<Row className='row-cols-1 row-cols-md-3 g-4 mx-auto mt-3'>
					{users.map(user => (
						<Col key={user._id} className='my-2'>
							<SingleUser user={user} />
						</Col>
					))}
				</Row>
				
				{/* Open Add Post Modal */}
				{/* <OverlayTrigger
					placement='left'
					overlay={<Tooltip>Add a new user</Tooltip>}
				> */}
					<Button
						className='btn-floating'
						onClick={setShowAddUserModal.bind(this, true)}
					>
						<img src={addIcon} alt='add-post' width='60' height='60' />
					</Button>
				{/* </OverlayTrigger> */}
			</>
			
		)
	}

	return <>
	{body}
	<AddUserModal />
	{user !== null && <UpdateUserModal />}
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

export default Users
