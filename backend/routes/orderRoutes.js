import express from "express"
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

import  {isAuth, isAdmin}  from "../utils.js";
import expressAsyncHandler from "express-async-handler"

const orderRouter = express.Router();


  orderRouter.post(
    '/',
     isAuth,
      expressAsyncHandler(async(req,res) => {
    const newOrder = new Order ({

        orderItems: req.body.orderItems.map((x) =>({...x,product: x._id})),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,

    })
    const order = await newOrder.save();
    res.status(201).send({message:'New Order Created', order});
 }));


orderRouter.get(
'/summary',
isAuth,
isAdmin,
expressAsyncHandler(async(req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1},
        totalSales: { $sum: 'totalprice'}
      }
    }
]);

  
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1}
      }
    }
  ])
  res.send({users, orders})
})
);


orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async(req,res) => {
    const orders = await Order.find({user: req.user._id})
    res.send(orders)
  })
)




 orderRouter.get(
  '/:id',
   isAuth,
    expressAsyncHandler(async(req,res) => {
  const order = await Order.findById(req.params.id);
  if(order) {
    res.send(order);
  } else {
    res.status(404).send({message:'Order hittades ej'})
  }

    })
 );

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async(req,res) => {
    const order = await Order.findById(req.params.id)
      
  
    if(order) {
      order.isPaid=true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address:req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({message:'Ordern är betald', order: updatedOrder});
    } else {
      res.status(404).send({message:'Ordern Hittades ej'})
    }
  })
)


export default orderRouter;