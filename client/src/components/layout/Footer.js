import React from "react";
import {
    Box,
    Container,
    Row,
    Column,
    FooterLink,
    Heading
    
} from "./FooterStyles";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const Footer = () => {
    return (
    <Box>
        {/* <h1 style={{ color: "black", 
                    textAlign: "center", 
                    marginTop: "-50px" }}>
        GeeksforGeeks: A Computer Science Portal for Geeks
        </h1> */}
        <Container>
        <Row>
            <Column>
            <Heading>About Us</Heading>
            <FooterLink href="#">Aim</FooterLink>
            <FooterLink href="#">Vision</FooterLink>
            <FooterLink href="#">Testimonials</FooterLink>
            </Column>

            <Column>
            <Heading>Services</Heading>
            <FooterLink href="#">Writing</FooterLink>
            <FooterLink href="#">Internships</FooterLink>
            <FooterLink href="#">Coding</FooterLink>
            <FooterLink href="#">Teaching</FooterLink>
            </Column>

            <Column>
            <Heading>Social Media</Heading>
            <FooterLink href="#">
                <i className="fab fa-facebook-f">
                <span style={{ marginLeft: "10px" }}>
                    Facebook
                </span>
                </i>
            </FooterLink>
            <FooterLink href="#">
                <i className="fab fa-instagram">
                <span style={{ marginLeft: "10px" }}>
                    Instagram
                </span>
                </i>
            </FooterLink>
            <FooterLink href="#">
                <i className="fab fa-twitter">
                <span style={{ marginLeft: "10px" }}>
                    Twitter
                </span>
                </i>
            </FooterLink>
            <FooterLink href="#">
                <i className="fab fa-youtube">
                <span style={{ marginLeft: "10px" }}>
                    Youtube
                </span>
                </i>
            </FooterLink>
            </Column>

            <Column>
            <Heading>Contact Us</Heading>
			<Form action="#" class="contact-form">

            <Form.Control type="email" placeholder="Your Email" />
            <Form.Text className="text-muted">
        
            </Form.Text>
            <Form.Control type="text" placeholder="Your Name" />
            <Form.Text className="text-muted">

            </Form.Text>
            
            <Form.Control type="text" placeholder="Message" />
            <Form.Text className="text-muted">

            </Form.Text>

            <Button variant="primary" >
            SEND
            </Button>
            </Form>
			
            </Column>
        </Row>
        <p class="text-xs-center">&copy; Copyright 2016 - City of USA.  All rights reserved.</p>
        </Container>
    </Box>
    );
};
export default Footer;