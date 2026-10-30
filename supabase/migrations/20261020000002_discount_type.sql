-- A discount can now be a percentage or a flat rupee amount, both taken off wastage + making only; discount_pct becomes discount_value.

create type discount_t as enum ('percentage', 'flat');

alter table products rename column discount_pct to discount_value;
alter table products drop constraint if exists products_discount_pct_check;
-- Wider than numeric(5,2), which tops out below ₹1,000 and could not hold a flat amount.
alter table products alter column discount_value type numeric(12,2);
alter table products add column discount_type discount_t not null default 'percentage';

alter table products add constraint products_discount_check
  check (discount_value >= 0 and (discount_type = 'flat' or discount_value <= 100));

comment on column products.discount_value is
  'Percent (discount_type = percentage) or rupees (flat) off wastage + making. 0 = no offer. A flat amount larger than wastage + making is capped at it.';
