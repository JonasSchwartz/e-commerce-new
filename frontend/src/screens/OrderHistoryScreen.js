import React, { useContext, useEffect, useReducer } from 'react'
import {Helmet} from "react-helmet-async"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { getError } from '../utils'
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"


const reducer = (state,action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state,loading: true};
            case 'FETCH_SUCCESS':
                return {...state,orders: action.payload, loading: false};
                case 'FETCH_FAIL':
                    return{...state,loading: false,error:action.payload};
                    default:
                        return state;
    }
};

export default function OrderHistoryScreen() {
    const {state} = useContext(Store);
    const {userInfo} = state
    const navigate = useNavigate();


const [{loading, error, orders}, dispatch] = useReducer(reducer,{
    loading: true,
    error:'',
});
useEffect(() => {
const fetchData = async () => {
    dispatch({type:'FETCH_REQUEST'});
    try {
        const {data} = await axios.get(
            `/api/orders/mine`,
            {headers: {Authorization: `Bearer ${userInfo.token}`}}
        );
        dispatch({type:'FETCH_SUCCESS', payload: data});
    } catch (error){
        dispatch({
            type:'FETCH_FAIL',
            payload:getError(error)
        });
    }
};
fetchData();
}, [userInfo]);

  return (
    <div>
    <Helmet>    
    
    <title>Orderhistorik</title>
    </Helmet>

    <h1>Orderhistorik</h1>

{loading ? (
        <LoadingBox></LoadingBox>
    ) : error ?(
        <MessageBox variant="danger">{error}</MessageBox>
    ): (

        
        <Table responsive="md" >
            
            <thead>

                <tr>
            <th>ID</th>
            <th>Datum</th>
            <th>Summa</th>
            <th>Betald</th>
            <th>Levererad</th>
            
            </tr>
            </thead>
            <tbody >
            
                {orders.map((order)=>(
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(0,10)}</td>
                        <td>{order.totalPrice.toFixed(2)}</td>
                        <td>{order.isPaid ? order.paidAt.substring(0,10) : 'Nej'}</td>
                        <td>{order.isDelivered ? order.isDelivered.substring(0,10): 'Nej'}
                        </td>
                        <td responsive="md">
                            <Button
                                type='Button'
                                variant="light"
                                onClick={() => {
                                    navigate(`/order/${order._id}`)
                                }}
                            >
                                Detaljer
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )}
  

    </div>
  ) 
}
