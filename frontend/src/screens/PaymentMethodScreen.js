import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import CheckoutSteps from '../components/CheckoutSteps'
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'
import { Store } from '../Store'
import {  useNavigate } from 'react-router-dom'


export default function PaymentMethodScreen() {
    const navigate = useNavigate()
    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {
        cart:{shippingAddress,paymentMethod},
    } = state;

const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
)


    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/payment')
        }
    },[shippingAddress,navigate])



    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod})
        localStorage.setItem('paymentMethod', paymentMethodName)
        navigate('/placeorder')
    }
  return (
    <div>
<CheckoutSteps step1 step2 step3></CheckoutSteps>
<div className='container small-container'>
    <Helmet>
        <title>Betalning</title>
    </Helmet>
    <h1 className='my-3'>Betalning</h1>

    <Form onSubmit={submitHandler}>

    <div className='mb-3'>
        <Form.Check
        type="radio"
        id="PayPal"
        label="PayPal"
        value="PayPal"
        checked={paymentMethodName ==='PayPal'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        />
    </div>

    <div className='mb-3'>
        <Form.Check
        type="radio"
        id="Klarna"
        label="Klarna"
        value="Klarna"
        checked={paymentMethodName ==='Klarna'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        />
    </div>

    <div className='mb-3'>
        <Button className='bg-dark border-light' type="submit">Fortsätt</Button>
    </div>


    </Form>

</div>
    </div>
  )
}
