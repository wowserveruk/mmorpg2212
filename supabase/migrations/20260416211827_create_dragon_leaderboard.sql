/*
  # Dragon Awaken Leaderboard

  1. New Tables
    - `dragon_leaderboard`
      - `id` (uuid, primary key)
      - `player_name` (text) - hero name chosen by player
      - `character_class` (text) - chosen class (Dragon Knight, Fire Mage, etc.)
      - `dragons_defeated` (integer) - number of dragons slain
      - `score` (integer) - total score
      - `created_at` (timestamptz) - when the score was submitted

  2. Security
    - Enable RLS on `dragon_leaderboard`
    - Allow public read access (anyone can view the leaderboard)
    - Allow public insert (anyone can submit a score without authentication)
*/

CREATE TABLE IF NOT EXISTS dragon_leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  character_class text NOT NULL,
  dragons_defeated integer DEFAULT 0,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dragon_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view leaderboard scores"
  ON dragon_leaderboard FOR SELECT
  TO anon, authenticated
  USING (score >= 0);

CREATE POLICY "Public can submit leaderboard scores"
  ON dragon_leaderboard FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    player_name IS NOT NULL
    AND length(trim(player_name)) > 0
    AND score >= 0
    AND dragons_defeated >= 0
  );
