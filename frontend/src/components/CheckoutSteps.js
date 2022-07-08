import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">

        <Col className={props.step1 ? 'active' : ''}>Logga In</Col>
        <Col className={props.step2 ? 'active' : ''}>Leverans</Col>
        <Col className={props.step3 ? 'active' : ''}>Betalning</Col>
        <Col className={props.step4 ? 'active' : ''}>Skicka Order</Col>
    </Row>
  )
}
