import { OrderStatus } from "@holyytaco/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDoc } from "./ticket";

// An interface that describes the properties
// that are requried to create a new User
interface OrderAttrs {
  ticket: TicketDoc;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}

// An interface that describes the properties
// that a User Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface that describes the properties
// that a User Document has
interface OrderDoc extends mongoose.Document {
  ticket: TicketDoc;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    userId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: mongoose.Schema.Types.Date },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
