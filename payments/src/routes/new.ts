import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  BadRequestError,
  validateRequest,
  NotFoundError,
  OrderStatus,
  NotAuthorizedError,
} from "@holyytaco/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token must be provided"),
    body("orderId").not().isEmpty().withMessage("Order ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    // Find the order the user is trying to pay for
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // Make sure the order belongs to the current user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Make sure the order has not been cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("You cannot pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // Stripe expects the amount in cents
      source: token,
    });

    // Save the payment to the database
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
