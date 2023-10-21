import { Publisher, Subjects, TicketUpdatedEvent } from "@holyytaco/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
