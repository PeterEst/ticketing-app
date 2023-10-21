import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher,
} from "@holyytaco/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
