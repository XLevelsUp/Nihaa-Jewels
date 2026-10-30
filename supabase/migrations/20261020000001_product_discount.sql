-- Per-product discount, applied to wastage and making only (never the gold value), with GST charged on the discounted amount, as GRT and the large jewellers do.

alter table products
  add column discount_pct numeric(5,2) not null default 0
    check (discount_pct >= 0 and discount_pct <= 100);

comment on column products.discount_pct is
  'Percent off wastage + making charges. 0 = no offer. The site shows the original price struck through and "N% Off".';
