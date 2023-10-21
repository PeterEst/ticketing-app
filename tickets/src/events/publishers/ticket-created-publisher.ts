import { Publisher, Subjects, TicketCreatedEvent } from "@holyytaco/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
