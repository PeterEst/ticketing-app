import { Publisher, Subjects, PaymentCreatedEvent } from "@holyytaco/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
