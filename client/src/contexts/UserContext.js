import { createContext, useReducer, useState } from 'react'
import { userReducer } from '../reducers/userReducer'
import {
	apiUrl,	
	USERS_LOADED_SUCCESS, 
	USERS_LOADED_FAIL, 
	ADD_USER,
	DELETE_USER,
	UPDATE_USER,
	FIND_USER,
	PROFILE_LOADED_SUCCESS,
	PROFILE_LOADED_FAIL,
	UPDATE_PROFILE,
	FIND_PROFILE
} from './constants'
import axios from 'axios'


export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
	// State
	const [userState, dispatch] = useReducer(userReducer, {
		user: null,
		users: [],
		usersLoading: true
	})

    const [showAddUserModal, setShowAddUserModal] = useState(false)
	const [showUpdateUserModal, setShowUpdateUserModal] = useState(false)
	const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false)

	const [showToast, setShowToast] = useState({
		show: false,
		message: '',
		type: null
	})
	// Get all user
	const getUsers = async () => {
		try {
			const response = await axios.get(`${apiUrl}/auth/users`)
			if (response.data.success) {
				dispatch({ type: USERS_LOADED_SUCCESS, payload: response.data.users })
			}
		} catch (error) {
			dispatch({ type: USERS_LOADED_FAIL })
		}
	}
	// Get my profile
	const getProfile = async () => {
		try {
			const response = await axios.get(`${apiUrl}/auth/profile`)
			if (response.data.success) {
				dispatch({ type: PROFILE_LOADED_SUCCESS, payload: response.data.user })
			}
		} catch (error) {
			dispatch({ type: PROFILE_LOADED_FAIL })
		}
	}
    //Create user
    const addUser = async newUser => {
		try {
			const response = await axios.post(`${apiUrl}/auth/create`, newUser)
			if (response.data.success) {
				dispatch({ type: ADD_USER, payload: response.data.newUser })
				return response.data
			}
		} catch (error) {
			return error.response.data
				? error.response.data
				: { success: false, message: 'Server error' }
		}
	}
	// Delete user
	const deleteUser = async userId => {
		try {
			const response = await axios.delete(`${apiUrl}/auth/${userId}`)
			if (response.data.success)
				dispatch({ type: DELETE_USER, payload: userId })
		} catch (error) {
			console.log(error)
		}
	}
	// Find user when user is updating user
	const findUser = userId => {
		const user = userState.users.find(user => user._id === userId)
		dispatch({ type: FIND_USER, payload: user })
	}
	// Update user 
	const updateUser = async updatedUser => {
		try {
			const response = await axios.put(
				`${apiUrl}/auth/${updatedUser._id}`,
				updatedUser
			)
			if (response.data.success) {
				dispatch({ type: UPDATE_USER, payload: response.data.post })
				return response.data
			}
		} catch (error) {
			return error.response.data
				? error.response.data
				: { success: false, message: 'Server error' }
		}
	}
	// Find user when user is updating user
	const findProfile = userId => {
		const user = userState.users.find(user => user._id === userId)
		dispatch({ type: FIND_PROFILE, payload: user })
	}
	// Update profile 
	const updateProfile = async updatedProfile => {
		try {
			const response = await axios.put(
				`${apiUrl}/auth/update/${updatedProfile._id}`,
				updatedProfile
			)
			if (response.data.success) {
				dispatch({ type: UPDATE_PROFILE, payload: response.data.post })
				return response.data
			}
		} catch (error) {
			return error.response.data
				? error.response.data
				: { success: false, message: 'Server error' }
		}
	}
    // user context data
    const userContextData = {
		userState, 
		getUsers, 
		showAddUserModal, 
		setShowAddUserModal, 
		addUser,
		showToast, 
		setShowToast,
		deleteUser,
		updateUser,
		findUser,
		showUpdateUserModal, 
		setShowUpdateUserModal,
		getProfile,
		updateProfile,
		showUpdateProfileModal, 
		setShowUpdateProfileModal,
		findProfile
	}


	return (
		<UserContext.Provider value={userContextData}>
			{children}
		</UserContext.Provider>
	)
}

export default UserContextProvider
