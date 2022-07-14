import React, { useContext, useEffect, useReducer } from 'react';
import Chart from "react-google-charts"
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      :  <MessageBox variant="danger">FEl</MessageBox>}
                  </Card.Title>
                  <Card.Text> Användare</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Ordrar</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    Kr{' '}
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Försäljning</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
                      <div className='my-3'>
                        <h2>Försäljning</h2>
                      {summary.dailyOrders.length === 0 ? (
                        <MessageBox>Ingen försäljning</MessageBox>
                      ): (
                        <Chart
                        width="100%"
                        height="400px"
                        chartType="AreaChart"
                        loader={<div>Laddar...</div>}
                        data={[
                          ['Date', 'Sales'],
                          ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                        ]}
                      ></Chart>
                      )}
                      <div className='my-3'>
                        <h2>Kategorier</h2>
                      {summary.productCategories.length === 0 ? (
                        <MessageBox>Ingen Kategori</MessageBox>
                      ): (
                        <Chart
                        width="100%"
                        height="400px"
                        chartType="PieChart"
                        loader={<div>Laddar...</div>}
                        data={[
                          ['Category', 'Products'],
                          ...summary.productCategories.map((x) => [x._id, x.count]),
                        ]}
                      ></Chart>
                      )}

                      </div>



                      </div>
    </>
)}

    </div>
  )
}
