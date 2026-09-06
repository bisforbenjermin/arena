-- 009 Views
-- PR-5: R2 normalizer queries this view to check cold-start thresholds
-- before returning a ranked percentile.

create view game_version_score_stats as
select
  tr.game_id,
  tr.game_version,
  count(*)                    as total_verified_scores,
  count(distinct s.player_id) as distinct_players
from scores s
join tournament_rounds tr on tr.id = s.tournament_round_id
where s.verified_raw_score is not null   -- bot-derived scores excluded: they are never stored here
group by tr.game_id, tr.game_version;

comment on view game_version_score_stats is
  'PR-5: R2 checks this view for cold-start threshold. '
  'A game version is NON-RANKING until total_verified_scores >= 200 AND distinct_players >= 30. '
  'Bot priors (G3) must never be inserted into scores; they feed on-screen feedback only.';
