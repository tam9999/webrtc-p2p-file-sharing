import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

import Table from 'react-bootstrap/Table'
// import ActionButtons from './ActionButtons'

const SingleProfile = ({ user: { _id, mail, username, password, role } }) => {
    let body = null
    
    body = (
    // <Card>
    //     <Card.Body>
	// 		<Card.Title>
	// 			<Row>
	// 				<Col>
	// 					<p className='post-title'>{username}</p>
	// 					<Badge
	// 						pill
	// 						variant={
	// 							role === 3 
    //                                 ? 'success'
    //                                 : role === 1
    //                                 ? 'warning'
    //                                 : 'danger'
	// 						}
	// 					>
	// 					</Badge>
	// 				</Col>
	// 				<Col className='text-right'>
	// 					<Card.Text password={password} _id={_id} />
                        
	// 				</Col>
	// 			</Row>
	// 		</Card.Title>
	// 		<Card.Text>{mail}</Card.Text>
    //         <Card.Text>{password}</Card.Text>
	// 	</Card.Body>
	// </Card>
    <Table striped bordered hover variant="dark">
        <thead>
            <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            </tr>
            <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            </tr>
            <tr>
            <td>3</td>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
            </tr>
        </tbody>
        </Table>
    )
    
    return  
    <>{body}</>
}

export default SingleProfile
