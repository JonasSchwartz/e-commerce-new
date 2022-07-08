import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import {Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

export default function SigninScreen() {
    const navigate = useNavigate();
    const {search} = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')

const {state, dispatch: ctxDispatch} = useContext(Store)
const {userInfo} = state;


    const submitHandler = async (e) => {
        e.preventDefault();     
        try{
            const {data} = await axios.post('/api/users/signin', {
        email,
        password,
            })
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
            } catch (err) {
                toast.error(getError(err));
            }
    };

    useEffect(()=> {
        if(userInfo) {
            navigate(redirect);
        }
    },[navigate,redirect, userInfo]);

    return (
    <Container className="container small-container">

        <Helmet>
            <title>Logga In</title>
        </Helmet>
        <h1 className="my-3">Logga In</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controllid="email">

            <Form.Label>Email</Form.Label>
            <Form.Control type="email"required onChange={(e) =>setEmail(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3" controllid="password">

            <Form.Label>Lösenord</Form.Label>
            <Form.Control type="password"required onChange={(e) =>setPassword(e.target.value)}/> 
        </Form.Group>
        <div className="mb-3">
            <Button type="submit">Logga In</Button>
        </div>
        <div className="mb-3">
            Ny Kund? {' '}
            <Link to={`/signup?redirect=${redirect}`}>Skapa Konto</Link>
        </div>


        </Form>
    </Container>
    )
}
