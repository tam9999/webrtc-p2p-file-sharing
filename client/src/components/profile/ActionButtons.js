import Button from 'react-bootstrap/Button'
// import playIcon from '../../assets/play-btn.svg'
import editIcon from '../../assets/pencil.svg'
import { UserContext } from '../../contexts/UserContext'
import { useContext } from 'react'

const ActionButtons = ({  _id }) => {
	const { 
		// deleteUser, 
		findProfile, 
		setShowUpdateProfileModal 
	} = useContext(
		UserContext
	)

	const chooseUser = userId => {
		findProfile(userId)
		setShowUpdateProfileModal(true)
	}

	return (
		<>
			
			{/* <Button className='post-button' >
				<img src={editIcon} alt='edit' width='24' height='24' />
			</Button> */}
			<Button className='post-button' onClick={chooseUser.bind(this, _id)}>
				<img src={editIcon} alt='edit' width='24' height='24' />
			</Button>
		</>
	)
}

export default ActionButtons
