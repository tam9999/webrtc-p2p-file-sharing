export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'https://localhost:300/api'
		: 'https://sleepy-inlet- 6101.herokuapp.com/api'
export const apiUrlRoom =
	process.env.NODE_ENV !== 'production'
		? 'https://webrtc-file-sharing.herokuapp.com'
		: 'https://sleepy-inlet- 6101.herokuapp.com'

export const LOCAL_STORAGE_TOKEN_NAME = 'webrtc-p2p'

export const POSTS_LOADED_SUCCESS = 'POSTS_LOADED_SUCCESS'
export const POSTS_LOADED_FAIL = 'POSTS_LOADED_FAIL'
export const ADD_POST = 'ADD_POST'
export const DELETE_POST = 'DELETE_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const FIND_POST = 'FIND_POST'

export const USERS_LOADED_SUCCESS = 'USERS_LOADED_SUCCESS'
export const USERS_LOADED_FAIL = 'USERS_LOADED_FAIL'
export const ADD_USER = 'ADD_USER'
export const DELETE_USER = 'DELETE_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const FIND_USER = 'FIND_USER'

export const PROFILE_LOADED_SUCCESS = 'PROFILE_LOADED_SUCCESS'
export const PROFILE_LOADED_FAIL = 'PROFILE_LOADED_FAIL'
export const UPDATE_PROFILE = 'UPDATE_PROFILE'
export const FIND_PROFILE = 'FIND_PROFILE'