-- Minimal seed: one region, one venue.
-- Run after all migrations on a fresh Supabase instance.

insert into regions (id, name, geo_bounds) values (
  '00000000-0000-0000-0000-000000000001',
  'Local Dev Region',
  '{"lat_min": 33.0, "lat_max": 34.0, "lng_min": -112.0, "lng_max": -111.0}'
);

insert into venues (id, region_id, name) values (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Local Dev Venue'
);
