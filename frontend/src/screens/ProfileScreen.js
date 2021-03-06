import React, { useContext, useReducer, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';



const reducer = (state,action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return{...state,loadingUpdate:true}
            case 'UPDATE_SUCCESS':
                return{...state, loadingUpdate:false}
                case 'UPDATE_FAIL' :
                    return{...state, loadingUpdate:false}
                    default: 
                    return state;
    }
};




export default function ProfileScreen() {
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState('')
    

    const [ dispatch] = useReducer(reducer, {
        loadingUpdate: false,
    })

    const submitHandler = async (e) =>{
        e.preventDefault();
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                },
                {
                    headers: {Authorization:`Bearer ${userInfo.token}`}
                }
            );
            dispatch({
                type:'UPDATE_SUCCESS'
            });
            ctxDispatch({type:'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo',JSON.stringify(data));
            toast.success('Profil Uppdaterad')
        } catch (err) {
              
            dispatch({
                type:'FETCH_FAIL'
            });
            toast.error(getError(err))
        }
    }
 

  return (
    <div className='container small-container' >
        <Helmet>
            <title>Anv??ndare</title>
        </Helmet>
        <h1 className='my-3'>Min Profil</h1>

        <form onSubmit={submitHandler}>
    <Form.Group className="mb-3" controllid="namn">
        <Form.Label>Namn</Form.Label>
        <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            requrired
        >

        </Form.Control>
    </Form.Group>

    <Form.Group className="mb-3" controllid="email">
        <Form.Label>Epost</Form.Label>
        <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            requrired
        >

        </Form.Control>
    </Form.Group>

    <Form.Group className="mb-3" controllid="password">
        <Form.Label>L??senord</Form.Label>
        <Form.Control
            type='password'
            
            onChange={(e) => setPassword(e.target.value)}
            requrired
        >

        </Form.Control>
    </Form.Group>
    
    
    <div className='mb-3'>
        <Button className='bg-dark border-light' type="submit">Uppdatera</Button>
    </div>
        </form>
    </div>
  )
}
