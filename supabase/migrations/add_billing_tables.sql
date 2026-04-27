-- Stripe billing tables (customers + subscriptions)
-- Stores Stripe IDs and subscription status per FiveStars user.

CREATE TABLE IF NOT EXISTS billing_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_customers_user_id_unique
  ON billing_customers(user_id);

CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_user_id
  ON billing_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status
  ON billing_subscriptions(status);

-- Enable RLS
ALTER TABLE billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own billing records
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own billing customers'
  ) THEN
    CREATE POLICY "Users can view their own billing customers"
      ON billing_customers FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own billing subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own billing subscriptions"
      ON billing_subscriptions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Keep updated_at fresh (reuses existing trigger fn if present)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_billing_customers_updated_at') THEN
      CREATE TRIGGER update_billing_customers_updated_at
        BEFORE UPDATE ON billing_customers
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_billing_subscriptions_updated_at') THEN
      CREATE TRIGGER update_billing_subscriptions_updated_at
        BEFORE UPDATE ON billing_subscriptions
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END IF;
END $$;

