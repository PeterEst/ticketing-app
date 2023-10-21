import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@holyytaco/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./constants/queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    // Acknowledge the message
    msg.ack();
  }
}
