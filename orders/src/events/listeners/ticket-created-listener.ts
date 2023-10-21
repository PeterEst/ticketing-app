import { Message } from "node-nats-streaming";
import { TicketCreatedEvent, Subjects, Listener } from "@holyytaco/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./constants/queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
