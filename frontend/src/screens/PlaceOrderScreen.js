import React, { useContext, useEffect, useReducer } from 'react'
import Axios from "axios"
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Helmet } from 'react-helmet-async'
import CheckoutSteps from "../components/CheckoutSteps"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import ListGroup from "react-bootstrap/ListGroup"
import { Store } from '../Store'
import { Link, useNavigate } from 'react-router-dom'
import {getError} from "../utils"
import {toast} from "react-toastify"
import LoadingBox from "../components/LoadingBox"


const reducer =(state,action) => {
    switch(action.type) {
        case 'CREATE_REQUEST':
            return{...state, loading:true};
            case 'CREATE_SUCCESS':
                return{...state, loading: false};
                case 'CREATE_FAIL':
                    return{...state,loading: false}
                    default:
                        return state;
    }
}

export default function PlaceOrderScreen() {
    const navigate = useNavigate();

    const[{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
        
    })


    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {cart, userInfo} = state;


    const round2 = (num) => Math.round(num*100 + Number.EPSILON) / 100;
    
       cart.itemsPrice = round2(
        cart.cartItems.reduce((a,c) => a+c.quantity * c.price,0)
       );

       cart.shippingPrice = cart.itemsPrice < 1000 ? (100) : (0)
       cart.taxPrice = round2(0.15 * cart.itemsPrice)
       cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = async () => {
        try {
            dispatch({type: 'CREATE_REQUEST'})
            const {data} = await Axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice:cart.shippingPrice,
                    taxPrice: cart.taxPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization:`Bearer ${userInfo.token}`,
                    },
                }
            );
            ctxDispatch({type: 'CART_CLEAR'});
            dispatch({type:'CREATE_SUCCESS'});
            localStorage.removeItem('cartItems')
            navigate(`/order/${data.order._id}`)
            toast.success(('Order beställd'));

        } catch(err) {
            dispatch({type: 'CREATE_FAIL'});
            toast.error(getError(err));
        }

    };

    useEffect(() =>{
    if (!cart.paymentMethod) {
        navigate('/payment')
    }
},[cart, navigate])


  return <div>
    

<CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

<Helmet>
    <title>Bekräfta Order</title>
</Helmet>

<h1 className='my-3'>Bekräfta Order</h1>

<Row>
    <Col md={8}>
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Address</Card.Title>
        <Card.Text>
                
            <strong>Namn</strong> {cart.shippingAddress.fullName} <br/>
            <strong>Address</strong> {cart.shippingAddress.address},
            {cart.shippingAddress.city},{cart.shippingAddress.postalCode},
            {cart.shippingAddress.country}
        </Card.Text>
        <Link className='text-dark' to="/shipping">Ändra</Link>
            </Card.Body>
        </Card>
        <Card className='mb-3'>
        <Card.Body>
            <Card.Title>Betalning</Card.Title>
            <Card.Text>
                <strong>Betalning</strong> {cart.paymentMethod}
            </Card.Text>
            <Link className='text-dark' to="/payment">Ändra</Link>
        </Card.Body>
        </Card>
        <Card>
            <Card.Body>
                <Card.Title>I Kundvagnen</Card.Title>
                <ListGroup variant='flush'>
                    {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                        <Row className='align-items-center'>
                            <Col md={6}>
                        <img src={item.image} alt={item.name}
                        className="  img-thumbnail"
                        ></img>{' '}
                        <Link className='text-decoration-none text-dark ' to={`/product/${item.slug}`}>{item.name}</Link>
                            </Col>     
                        <Col md={3}><span>{item.quantity}st</span></Col>
                        <Col md={3}><b>{item.price} Kr</b></Col>
                        </Row>
                    </ListGroup.Item>
                    ))}
                </ListGroup>
                
            </Card.Body>
            <Link className='text-dark' to='/cart'>Ändra</Link>
            </Card>

    </Col>

<Col md={4}>

    <Card>
   <Card.Body>
    <Card.Title>Din order:</Card.Title>
    
        <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Row>
                                <Col>Produkter</Col>
                            <Col>{cart.itemsPrice.toFixed(2)}kr</Col>

                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <Row>
                            <Col>Leverans</Col>
                            <Col>{cart.shippingPrice.toFixed(2)}</Col>
                        </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <Row>
                            <Col>Moms</Col>
                            <Col>{cart.taxPrice.toFixed(2)}</Col>
                        </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                        <Row>
                            <Col>
                            <strong>Totalt:</strong>
                            </Col>
                            <Col>
                            <strong>{cart.totalPrice.toFixed(2)}Kr</strong>
                            </Col>
                        </Row>
                        </ListGroup.Item>
        
                            <ListGroup.Item>
                                <div className='d-grid'>
                                    <Button
                                    className='bg-dark border-light'
                                    type="button"
                                    onClick={placeOrderHandler}
                                    disabled={cart.cartItems === 0}
                                    >
                                        Beställ
                                    </Button>
                                </div>
                                {loading && <LoadingBox></LoadingBox>}
                            </ListGroup.Item>
        
        
        
        </ListGroup>

    </Card.Body> 

    </Card>
</Col>



</Row>

    </div>
}