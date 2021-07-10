export const authReducer = (state, action) => {
	const {
		type,
		payload: { isAuthenticated, isCheckRole, user  }
	} = action

	switch (type) {
		case 'SET_AUTH':
			return {
				...state,
				authLoading: false,
				isAuthenticated,
				isCheckRole,
				user
			}

		// case 'GET_LOADED_SUCCESS':
		// 	return {
		// 		...state,
		// 		authLoading: false,
		// 		isAuthenticated,
		// 		isCheckRole,
		// 		users:  payload.users,
		// 		usersLoading: false
		// 	}

		default:
			return state
	}
}
