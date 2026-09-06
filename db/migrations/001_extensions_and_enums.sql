-- 001 Extensions and enums
-- Run first. All other migrations depend on these types.

create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- future: fuzzy handle search

-- PR-6: tilt is in the enum (reserved, unimplemented at launch).
-- G6 pool-eligibility check and the game_pool constraint enforce it never goes active.
create type control_scheme as enum ('tap', 'hold', 'swipe', 'tilt', 'drag', 'rhythm');

create type difficulty_curve as enum ('flat', 'ramp', 'spike');
create type generated_by     as enum ('human', 'agent', 'reskin');
create type game_status      as enum ('candidate', 'active', 'retired');
create type tournament_status as enum ('pending', 'active', 'completed', 'cancelled');
