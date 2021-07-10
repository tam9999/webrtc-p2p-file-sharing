import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import AlertMessage from '../layout/AlertMessage'

const AddUserModal = () => {
	// Contexts
	const {
		showAddUserModal,
		setShowAddUserModal,
		addUser,
		setShowToast
	} = useContext(UserContext)

	// State
	const [newUser, setNewUser] = useState({
		mail: '',
		username: '',
		password: '',
		comfirmPassword: '',
		role: 1
	})

	const { mail, username, password, confirmPassword, role } = newUser
	const [alert, setAlert] = useState(null)
	const onChangeNewUserForm = event =>
		setNewUser({ ...newUser, [event.target.name]: event.target.value })

	const closeDialog = () => {
		resetAddUserData()
	}

	const onSubmit = async event => {
		event.preventDefault()
		if (password !== confirmPassword) {
			setAlert({ type: 'danger', message: 'Passwords do not match' })
			setTimeout(() => setAlert(null), 5000)
			return
		}
		// try {
		// 	const registerData = await addUser(newUser)
		// 	if (!registerData.success) {
		// 		setAlert({ type: 'danger', message: registerData.message })
		// 		setTimeout(() => setAlert(null), 5000)
		// 	}
		// } catch (error) {
		// 	console.log(error)
		// }
		const { success, message } = await addUser(newUser)
		resetAddUserData()
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	const resetAddUserData = () => {
		setNewUser({ mail: '', username: '', password: '', confirmPassword: '', role: 1 })
		setShowAddUserModal(false)
	}

	return (
		<Modal show={showAddUserModal} animation={false} onHide={closeDialog} >
			<Modal.Header closeButton>
				<Modal.Title>Create USer</Modal.Title>
			</Modal.Header>
			<Form onSubmit={onSubmit} >
			<AlertMessage info={alert} />
				<Modal.Body>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Enter Mail'
							name='mail'
							required
							aria-describedby='title-help'
							value={mail}
							onChange={onChangeNewUserForm}
						/>
						{/* <Form.Text id='title-help' muted>
							Required
						</Form.Text> */}
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Username'
							name='username'
							required
							value={username}
							onChange={onChangeNewUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='password'
							placeholder='Password'
							name='password'
							required
							value={password}
							onChange={onChangeNewUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							name='confirmPassword'
							required
							value={confirmPassword}
							onChange={onChangeNewUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							// type='number'
							as='select'
							name='role'
							value={role}
							onChange={onChangeNewUserForm}
						>
							<option value='1'>User</option>
							<option value='3'>Admin</option>
						</Form.Control>
					</Form.Group>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={closeDialog} >
						Cancel
					</Button>
					<Button variant='primary' type='submit'>
						Create
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

export default AddUserModal
