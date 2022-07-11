import React, { useContext, useEffect, useReducer } from 'react'
import {Store} from "../Store"
import axios from "axios"
import { getError } from '../utils';
import {useNavigate} from "react-router-dom"
import {Helmet} from "react-helmet-async"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import Button from "react-bootstrap/Button"



const reducer = (state, action) => {
switch (action.type) {
case 'FETCH_REQUEST':
    return{...state, loading: true}
    case 'FETCH_SUCCESS':
        return {
            ...state,
            orders: action.payload,
            loading: false
        };
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
            default:
                return state;

}
}



export default function OrderListScreen() {
const navigate = useNavigate();
const {state} = useContext(Store)
const {userInfo} = state;
const [{loading, error, orders}, dispatch] = useReducer(reducer, {
    loading: true,
    error:''
})

useEffect(() => {
const fetchData = async () => {
try {
    dispatch({type: 'FETCH_REQUEST'})
    const {data} = await axios.get(`/api/orders`, {
        headers: {Authorization: `Bearer ${userInfo.token}`}

    });

    dispatch({type: 'FETCH_SUCCESS', payload: data})
        }catch(err) {
        dispatch({
        type:'FETCH_FAIL',
        payload: getError(err),
        
    })
    


}
}
fetchData()
},[userInfo])
  return (
    <div>
        <Helmet>
            <title>Ordrar</title>
        </Helmet>

        <h1>Ordrar</h1>
        {loading ? (
        <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant ="danger">{error}</MessageBox>
        ) : (
            <table className='table'>
<thead>
    <tr>
        <th>ID</th>
        <th>Användare</th>
        <th>Datum</th>
        <th>Totalt</th>
        <th>Betald</th>
        <th>Skickad</th>
        <th>Actions</th>
          </tr>
        </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order._id}>
                           <td>{order._id}</td> 
                           <td>{order.user ? order.user.name : 'Användare borttagen'}</td>
                           <td>{order.createdAt.substring(0,10)}</td>
                           <td>{order.totalPrice}</td>
                           <td>{order.isPaid ? order.paidAt.substring(0,10):'Ej betald'}</td>
                           <td>{order.isDelivered
                           ? order.deliviredAt.substring(0,10) 
                           : 'Ej skickad'}</td>
                           <td>
                            <Button
                            type="button"
                            variant="light"
                            onClick={() => {
                                navigate(`/order/${order._id}`)
                            }}>Detaljer</Button>
                           </td>
                    </tr>
                ))}

            
            </tbody>
            </table>
        ) }
    </div>
  )
}
