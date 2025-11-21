-- server/db/schema.sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE technicians (
  id serial PRIMARY KEY,
  name text NOT NULL,
  phone text,
  email text,
  city text,
  pin text,
  address text,
  service_types text[], -- e.g. ARRAY['ev','solar','appliance']
  rating numeric(2,1) DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  geom geometry(Point, 4326) -- lat/lon
);

CREATE INDEX ON technicians USING GIST (geom);
CREATE INDEX ON technicians (pin);
CREATE INDEX ON technicians (city);
