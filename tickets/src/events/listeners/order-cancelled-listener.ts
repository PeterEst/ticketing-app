import { Listener, OrderCancelledEvent, Subjects } from "@holyytaco/common";
import { queueGroupName } from "./constants/queue-group-name";
import { Ticket } from "../../models/Ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: import("node-nats-streaming").Message
  ) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
