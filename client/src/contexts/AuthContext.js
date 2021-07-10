import { createContext, useReducer, useEffect } from 'react'
import { authReducer } from '../reducers/authReducer'
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
	const [authState, dispatch] = useReducer(authReducer, {
		authLoading: true,
		isAuthenticated: false,
		isCheckRole: false,  
		user: null
	})

	// Authenticate user
	const loadUser = async () => {
		if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
			setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
		}

		try {
			const response = await axios.get(`${apiUrl}/auth`)
			//console.log(response.data.user.role)
			if (response.data.success && response.data.user.role === 3) {
				dispatch({
					type: 'SET_AUTH',
					payload: { isAuthenticated: true, isCheckRole: true, user: response.data.user }
				})
			}else {
				dispatch({
					type: 'SET_AUTH',
					payload: { isAuthenticated: true, isCheckRole: false, user: response.data.user }
				})
			}
		} catch (error) {
			localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
			setAuthToken(null)
			dispatch({
				type: 'SET_AUTH',
				payload: { isAuthenticated: false, isCheckRole: null, user: null }
			})
		}
	}

	useEffect(() => loadUser(), [])

	// // Get all posts
	// const getAllUsers = async () => {
	// 	try {
	// 		const response = await axios.get(`${apiUrl}/auth/users`)
	// 		if (response.data.success) {
	// 			dispatch({
	// 				type: 'GET_AUTH',
	// 				payload: { isAuthenticated: true, isCheckRole: true, users: response.data.users }
	// 			})
	// 		}
	// 	} catch (error) {
	// 		return error.response.data 
	// 		? error.response.data
	// 		: { success: false, message: 'Server error'}
	// 	}
	// }

	// Login
	const loginUser = async userForm => {
		try {
			const response = await axios.post(`${apiUrl}/auth/login`, userForm)
			if (response.data.success)
				localStorage.setItem(
					LOCAL_STORAGE_TOKEN_NAME,
					response.data.accessToken
				)
				
			await loadUser()
			
			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	// Register
	const registerUser = async userForm => {
		try {
			const response = await axios.post(`${apiUrl}/auth/register`, userForm)
			if (response.data.success)
				localStorage.setItem(
					LOCAL_STORAGE_TOKEN_NAME,
					response.data.accessToken
				)

			await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	// Logout
	const logoutUser = () => {
		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
		dispatch({
			type: 'SET_AUTH',
			payload: { isAuthenticated: false, user: null }
		})
	}

	// Context data
	const authContextData = { loginUser, registerUser, logoutUser, authState }

	// Return provider
	return (
		<AuthContext.Provider value={authContextData}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider
