-- Create favorites table for users to save their favorite vehicles
CREATE TABLE IF NOT EXISTS public.favorites (
    favorite_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    inv_id INT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    CONSTRAINT unique_favorite UNIQUE (account_id, inv_id)
);
-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_account ON public.favorites(account_id);
CREATE INDEX IF NOT EXISTS idx_favorites_inv ON public.favorites(inv_id);
-- Sample comment explaining the table
COMMENT ON TABLE public.favorites IS 'Stores user favorite vehicles for quick access';