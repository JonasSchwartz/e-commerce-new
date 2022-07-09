import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import {   useParams } from "react-router-dom"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup"
import Rating from "../components/Rating";
import Badge from "react-bootstrap/Badge"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";

const reducer = (state,action) => {
    switch(action.type) {
        case `FETCH_REQUEST`:
            return{...state,loading: true};
         case `FETCH_SUCCESS`:
            return  {...state,product:action.payload, loading: false};
          case `FETCH_FAIL`:
            return{...state,loading:false, error: action.payload};
            default:   
            return state;
    }
}






function ProductScreen () {
    
const params = useParams();
const  {slug} = params;

const [{loading, error,product}, dispatch] = useReducer(reducer, {
    product:[],
    loading: true,
    error: ``,
})

useEffect(() => {
const fetchData = async () => {
dispatch({type: `FETCH_REQUEST`})
try {
const result = await axios.get(`/api/products/slug/${slug}`);
dispatch({type:`FETCH_SUCCESS`, payload: result.data})
} catch(err) {
    dispatch({type: `FETCH_FAIL`, payload: getError(err)})
    }   
};
fetchData();
},[slug])


const {state, dispatch: ctxDispatch} = useContext(Store);
const {cart} = state;
const addToCartHandler = async () => {
 const existItem = cart.cartItems.find((x) =>x._id === product._id)
 const quantity = existItem ? existItem.quantity + 1 : 1
 const { data } = await axios.get(`/api/products/${product._id}`)


if (data.countInStock < quantity) {
    window.alert("Sorry, Product is out of stock");
    return;
}

ctxDispatch({
    type:'CART_ADD_ITEM',
     payload: {...product, quantity}})
}




return loading? (
    <LoadingBox/>
) : error? (
    <MessageBox variant="danger">{error}</MessageBox>
): (
  <div>
  <Row>
    <Col md={6}>
        <img
         className="img-large"
        src={product.image}
        alt={product.name}
       ></img>
    </Col>
    
    <Col md={3}>
    <ListGroup variant="flush">
        <ListGroup.Item>
           <Helmet>
            <title>{product.name}</title>
           </Helmet>
                <h1>{product.name}</h1>

           
            
        </ListGroup.Item>
        <ListGroup.Item>
            <Rating
              rating={product.rating}
              numReviews={product.numReviews}
            ></Rating>
        </ListGroup.Item>
        <ListGroup.Item> Pris : {product.price} sek</ListGroup.Item>
           
        <ListGroup.Item> Beskrivning:
            <p>{product.description}</p>
        </ListGroup.Item>

    </ListGroup>

    </Col>
    <Col md={3}>
        <Card>
            <Card.Body>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col>Pris:</Col>
                        <Col>{product.price} sek</Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>status:</Col>
                        <Col>{product.countInStock>0?
                        <Badge bg="success"> {product.countInStock}st i lager</Badge>
                            :
                            <Badge bg="danger">Ej tillgänglig</Badge>
                    } </Col>
                    </Row>
                </ListGroup.Item>
                        {product.countInStock > 0 && (
                            <ListGroup.Item>
                                <div className="d-grid">
                                    <Button onClick={addToCartHandler} className="bg-dark border-none" variant="primary">
                                        Köp
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        )}


                </ListGroup>
            </Card.Body>
        </Card>
    </Col>
  </Row>
  </div>
  
    
)
}






export default ProductScreen