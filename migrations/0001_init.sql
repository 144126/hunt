create table p (
  i text primary key,
  h text not null,
  s text not null,
  u text not null,
  e text,
  a text,
  t text not null,
  c text,
  g integer default 0,
  k integer default 0,
  d text
);
create index p_h_c on p (h, c desc);
