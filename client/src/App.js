import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './components/layout/Landing'
import Auth from './views/Auth'
import AuthContextProvider from './contexts/AuthContext'
import Dashboard from './views/Dashboard'
import ProtectedRoute from './components/routing/ProtectedRoute'
import About from './views/About'
import Room from './views/Room'
import CreateRoom from './views/CreateRoom'
import Rooms from './views/Rooms'
import CreateRooms from './views/CreateRooms'
import Users from './views/Users'
import Profile from './views/Profile'
import PostContextProvider from './contexts/PostContext'
import UserContextProvider from './contexts/UserContext'

function App() {
	return (
		<AuthContextProvider>
			<PostContextProvider>
				<UserContextProvider>
					<Router>
						<Switch>
							<Route exact path='/' component={Landing} />
							<Route
								exact
								path='/login'
								render={props => <Auth {...props} authRoute='login' />}
							/>
							<Route
								exact
								path='/register'
								render={props => <Auth {...props} authRoute='register' />}
							/>
							<ProtectedRoute exact path='/dashboard' component={Dashboard} />
							<ProtectedRoute exact path='/about' component={About} />						
							<ProtectedRoute exact path='/room/:roomID' component={Room} />
							<ProtectedRoute exact path='/room' exact component={CreateRoom} />
							<ProtectedRoute exact path='/users' exact component={Users} />
							<ProtectedRoute exact path='/profile' exact component={Profile} />
							<Route exact path='/rooms/:roomID' component={Rooms} />
							<Route exact path='/rooms' exact component={CreateRooms} />
						</Switch>				
					</Router>
				</UserContextProvider>	
			</PostContextProvider>			
		</AuthContextProvider>	
	)
}

export default App
