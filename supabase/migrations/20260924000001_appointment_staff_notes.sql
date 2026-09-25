-- appointments.notes is the customer's message; staff need a separate place to record call outcomes.
alter table appointments
  add column staff_notes text;

comment on column appointments.staff_notes is
  'Internal only. Never exposed to the public site — appointments has no anon SELECT policy.';
