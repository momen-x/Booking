-- Enable extension (required for range types)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add exclusion constraint
ALTER TABLE "Booking"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  "providerId" WITH =,
  tsrange("startTime", "endTime") WITH &&
)
WHERE ("deletedAt" IS NULL AND status = 'CONFIRMED');