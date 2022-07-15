import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import {Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";


export default function SignUpScreen() {
    const navigate = useNavigate();
    const {search} = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/'
     
    
    const[name, setName] = useState('')
    const[password,setPassword] = useState('')
    const[email,setEmail] = useState('')
    const[confirmPassword,setConfirmPassword] = useState('')

const {state, dispatch: ctxDispatch} = useContext(Store)
const {userInfo} = state;


    const submitHandler = async (e) => {
        e.preventDefault(); 
        

        if(password !== confirmPassword) {
            toast.error('Lösenordet matchar inte')
            return;
        }    
        try{
            const {data} = await axios.post('/api/users/signup', {
                name,
                email,
                password,
            })
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
            } catch (err) {
                toast.error('Din emailaddress är redan registrerad');
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
            <title>Skapa Konto</title>
        </Helmet>
        <h1 className="my-3">Skapa Konto</h1>
        <Form onSubmit={submitHandler}>

        <Form.Group className="mb-3" controllid="name">
        <Form.Label>Namn</Form.Label>
        <Form.Control type="name"required onChange={(e) =>setName(e.target.value)}/>
        </Form.Group>




         <Form.Group className="mb-3" controllid="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email"required onChange={(e) =>setEmail(e.target.value)}/>
        </Form.Group>

        

        

        <Form.Group className="mb-3" controllid="password">

            <Form.Label>Lösenord</Form.Label>
            <Form.Control type="password"required onChange={(e) =>setPassword(e.target.value)}/> 
        </Form.Group>

        <Form.Group className="mb-3" controllid="password">

<Form.Label>Bekräfta Lösenord</Form.Label>
<Form.Control type="password"required onChange={(e) =>setConfirmPassword(e.target.value)}/> 
</Form.Group>



        <div className="mb-3">
            <Button className="bg-dark border-light" type="submit">Skapa Konto</Button>
        </div>
        <div className="mb-3">
            Har du redan ett konto? {' '}
            <Link to={`/signin?redirect=${redirect}`}>Logga In</Link>
        </div>


        </Form>
    </Container>
    )
}
