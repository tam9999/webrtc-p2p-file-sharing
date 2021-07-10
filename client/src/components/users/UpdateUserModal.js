import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import AlertMessage from '../layout/AlertMessage'

const UpdateUserModal = () => {
	// Contexts
	const {
		userState: { user },
		showUpdateUserModal,
		setShowUpdateUserModal,
		updateUser,
		setShowToast
	} = useContext(UserContext)

	// State
	const [updatedUser, setUpdatedUser] = useState(user)

	useEffect(() => setUpdatedUser(user), [user])

	const { mail, username, password, confirmPassword, role } = updatedUser

	const [alert, setAlert] = useState(null)

	const onChangeUpdatedUserForm = event =>
		setUpdatedUser({ ...updatedUser, [event.target.name]: event.target.value })

	const closeDialog = () => {
		setUpdatedUser(user)
		setShowUpdateUserModal(false)
	}
	
	const onSubmit = async event => {
		event.preventDefault()
		const { success, message } = await updateUser(updatedUser)
		// confirm password
		if (password !== confirmPassword) {
			setAlert({ type: 'danger', message: 'Passwords do not match' })
			setTimeout(() => setAlert(null), 5000)
			return
		}
		//Alert
		setShowUpdateUserModal(false)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	// const resetAddPostData = () => {
	// 	setNewPost({ title: '', description: '', url: '', status: 'TO LEARN' })
	// 	setShowAddPostModal(false)
	// }

	return (
		<Modal show={showUpdateUserModal} onHide={closeDialog} >
			<Modal.Header closeButton>
				<Modal.Title>Update User</Modal.Title>
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
							onChange={onChangeUpdatedUserForm}
						/>
						
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Username'
							name='username'
							required
							value={username}
							onChange={onChangeUpdatedUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='password'
							placeholder='Password'
							name='password'
							required
							value={password}
							onChange={onChangeUpdatedUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							name='confirmPassword'
							
							value={confirmPassword}
							onChange={onChangeUpdatedUserForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							// type='number'
							as='select'
							name='role'
							value={role}
							onChange={onChangeUpdatedUserForm}
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
						Update
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

export default UpdateUserModal
