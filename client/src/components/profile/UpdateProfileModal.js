import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../contexts/UserContext'
import AlertMessage from '../layout/AlertMessage'

const UpdateProfileModal = () => {
	// Contexts
	const {
		userState: { profile },
		showUpdateProfileModal,
		setShowUpdateProfileModal,
		updateProfile,
		setShowToast
	} = useContext(UserContext)

	// State
	const [updatedProfile, setUpdatedProfile] = useState(profile)

	useEffect(() => setUpdatedprofile(profile), [profile])

	const { mail, username, password, confirmPassword } = updatedProfile

	const [alert, setAlert] = useState(null)

	const onChangeUpdatedProfileForm = event =>
		setUpdatedProfile({ ...updatedProfile, [event.target.name]: event.target.value })

	const closeDialog = () => {
		setUpdatedProfile(profile)
		setShowUpdateProfileModal(false)
	}
	
	const onSubmit = async event => {
		event.preventDefault()
		const { success, message } = await updateProfile(updatedProfile)
		// confirm password
		if (password !== confirmPassword) {
			setAlert({ type: 'danger', message: 'Passwords do not match' })
			setTimeout(() => setAlert(null), 5000)
			return
		}
		//Alert
		setShowUpdateProfileModal(false)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	// const resetAddPostData = () => {
	// 	setNewPost({ title: '', description: '', url: '', status: 'TO LEARN' })
	// 	setShowAddPostModal(false)
	// }

	return (
		<Modal show={showUpdateProfileModal} onHide={closeDialog} >
			<Modal.Header closeButton>
				<Modal.Title>Update My Profile</Modal.Title>
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
							onChange={onChangeUpdatedProfileForm}
						/>
						
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Username'
							name='username'
							required
							value={username}
							onChange={onChangeUpdatedProfileForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='password'
							placeholder='Password'
							name='password'
							required
							value={password}
							onChange={onChangeUpdatedProfileForm}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							name='confirmPassword'
							
							value={confirmPassword}
							onChange={onChangeUpdatedProfileForm}
						/>
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

export default UpdateProfileModal
