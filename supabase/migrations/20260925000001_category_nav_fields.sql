-- The public navigation reads categories directly, so the badge and menu-visibility
-- it displays have to be staff-editable like everything else about a category.

alter table categories
  add column badge text,
  add column show_in_nav boolean not null default true;

comment on column categories.badge is
  'Short label shown on the mega-menu card, e.g. NEW ARRIVAL. Null hides it.';
comment on column categories.show_in_nav is
  'A category can be live at its own URL without appearing in the main menu.';

update categories set badge = 'SIGNATURE'   where slug = 'rings';
update categories set badge = 'BESTSELLER'  where slug = 'necklaces';
update categories set badge = 'NEW ARRIVAL' where slug = 'earrings';
update categories set badge = 'HANDCRAFTED' where slug = 'bangles';
update categories set badge = 'BRIDAL EDIT' where slug = 'bridal';
update categories set badge = 'HERITAGE'    where slug = 'temple';
update categories set badge = 'EVERYDAY'    where slug = 'daily-wear';
