import { PostContext } from '../contexts/PostContext'
import { AuthContext } from '../contexts/AuthContext'
import { useContext, useEffect } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Toast from 'react-bootstrap/Toast'

import AddPostModal from '../components/posts/AddPostModal'
import UpdatePostModal from '../components/posts/UpdatePostModal'

import { Link } from 'react-router-dom'

const Dashboard = () => {
	// Contexts
	const {
		authState: {
			user: { username }
		}
		// getAllUsers
	} = useContext(AuthContext)

	const {
		postState: { post, posts, postsLoading },
		getPosts,
		setShowAddPostModal,
		showToast: { show, message, type },
		setShowToast
	} = useContext(PostContext)

	// Start: Get all posts
	useEffect(() => getPosts(), [])
	//Start: Get all users
	//useEffect(() => getAllUsers(), [])
	let body = null

	if (postsLoading) {
		body = (
			<div className='spinner-container'>
				<Spinner animation='border' variant='info' />
			</div>
		)
	} else if (posts.length === 0) {
		body = (
			<>
				<Card className='text-center mx-5 my-5'>
					<Card.Header as='h1'>Hi {username}</Card.Header>
					<Card.Body>
						<Card.Title>Welcome to WebRTC file sharing P2P</Card.Title>
						<Card.Text>
							Click the button below to track your first sharing file
						</Card.Text>
						<Button
							variant='primary'
							to='/room'
							as={Link}
						>
							GET STARTED!!!
						</Button>
					</Card.Body>
				</Card>
			</>
		)
	} else {
		body = (
			<>
				<Card className='text-center mx-5 my-5'>
					<Card.Header as='h1'>Hi {username}</Card.Header>
					<Card.Body>
						<Card.Title>Welcome to WebRTC file sharing P2P</Card.Title>
						<Card.Text>
							Click the button below to track your first sharing file
						</Card.Text>
						<Button
							variant='primary'
							to='/room'
							as={Link}
						>
							GET STARTED!!!
						</Button>
					</Card.Body>
				</Card>
			</>
			
		)
	}

	return (
		<>
			{body}
			<AddPostModal />
			{post !== null && <UpdatePostModal />}
			{/* After post is added, show toast */}
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
	)
}

export default Dashboard
