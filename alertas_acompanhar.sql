create table if not exists protocolo_alertas_wpp (
  id bigint generated always as identity primary key,
  destino text,
  motivo text not null,
  criado_em timestamptz not null default now(),
  resolvido boolean not null default false,
  resolvido_em timestamptz
);

alter table protocolo_alertas_wpp enable row level security;

create policy "protocolo_alertas_wpp_select" on protocolo_alertas_wpp
  for select to anon using (true);

create policy "protocolo_alertas_wpp_insert" on protocolo_alertas_wpp
  for insert to anon with check (true);

create policy "protocolo_alertas_wpp_update" on protocolo_alertas_wpp
  for update to anon using (true) with check (true);
