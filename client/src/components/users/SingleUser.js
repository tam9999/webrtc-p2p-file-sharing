import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import ActionButtons from './ActionButtons'

const SingleUser = ({ user: { _id, mail, username, password, role } }) => {
    let body = null
    
    if (role===3) {
        body = (
        <Card>
        <Card.Body>
			<Card.Title>
				<Row>
					<Col>
						<p className='post-title'>{username}</p>
						<Badge
							pill
							variant={
								role === 3 
                                    ? 'success'
                                    : role === 1
                                    ? 'warning'
                                    : 'danger'
							}
						>
							{'admin'}
						</Badge>
					</Col>
					<Col className='text-right'>
						<Card.Text password={password} _id={_id} />
                        <ActionButtons />
					</Col>
				</Row>
			</Card.Title>
			<Card.Text>{mail}</Card.Text>
            <Card.Text>{password}</Card.Text>
		</Card.Body>
	</Card>
        )
    } else {
        body = (
            <Card>
        <Card.Body>
			<Card.Title>
				<Row>
					<Col>
						<p className='post-title'>{username}</p>
						<Badge
							pill
							variant={
								role === 3 
                                    ? 'success'
                                    : role === 1
                                    ? 'warning'
                                    : 'danger'
							}
						>
							{'user'}
						</Badge>
					</Col>
					<Col className='text-right'>
						<Card.Text password={password} _id={_id} />
                        <ActionButtons _id={_id} />
					</Col>
				</Row>
			</Card.Title>
			<Card.Text>{mail}</Card.Text>
            <Card.Text>{password}</Card.Text>
		</Card.Body>
	</Card>
        )
    } 
    return  <>{body}</>
}

export default SingleUser
