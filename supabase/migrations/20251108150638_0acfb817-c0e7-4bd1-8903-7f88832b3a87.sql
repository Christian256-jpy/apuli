-- BIBIYANO POS SYSTEM DATABASE SCHEMA
-- Integrating with existing profiles and user_roles tables

-- 1️⃣ PRODUCTS TABLE
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    barcode VARCHAR(50) UNIQUE,
    unit_price_buy NUMERIC(12,2) NOT NULL,
    unit_price_sell NUMERIC(12,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    supplier_info TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ TRANSACTIONS TABLE
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) CHECK (type IN ('sale', 'purchase')) NOT NULL,
    cashier_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('cash', 'mtn', 'airtel')) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0.00,
    tax NUMERIC(10,2) DEFAULT 0.00,
    date_time TIMESTAMP DEFAULT NOW()
);

-- 3️⃣ TRANSACTION ITEMS TABLE
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- 4️⃣ CASH MANAGEMENT TABLE
CREATE TABLE cash_management (
    cash_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) CHECK (type IN ('cash_at_hand', 'cash_at_bank')) NOT NULL,
    balance NUMERIC(14,2) DEFAULT 0.00,
    related_transaction UUID REFERENCES transactions(transaction_id),
    date_time TIMESTAMP DEFAULT NOW()
);

-- 5️⃣ DEBTS TABLE
CREATE TABLE debts (
    debt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('receivable', 'payable')) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE,
    status VARCHAR(20) CHECK (status IN ('pending', 'paid')) DEFAULT 'pending',
    linked_transaction UUID REFERENCES transactions(transaction_id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6️⃣ PAYMENTS TABLE
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('cash', 'mtn', 'airtel')) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    reference_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'confirmed',
    date_time TIMESTAMP DEFAULT NOW()
);

-- 7️⃣ RECEIPTS TABLE
CREATE TABLE receipts (
    receipt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    cashier_id UUID REFERENCES auth.users(id),
    business_name VARCHAR(100),
    payment_method VARCHAR(20),
    total NUMERIC(12,2),
    printed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8️⃣ AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100),
    target_table VARCHAR(50),
    target_id UUID,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- 🔒 ENABLE ROW LEVEL SECURITY
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 📋 RLS POLICIES FOR PRODUCTS
CREATE POLICY "All authenticated users can view products"
ON products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can update products"
ON products FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete products"
ON products FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR TRANSACTIONS
CREATE POLICY "All authenticated users can view transactions"
ON transactions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can insert transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can update transactions"
ON transactions FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete transactions"
ON transactions FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR TRANSACTION ITEMS
CREATE POLICY "All authenticated users can view transaction items"
ON transaction_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can insert transaction items"
ON transaction_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can update transaction items"
ON transaction_items FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete transaction items"
ON transaction_items FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR CASH MANAGEMENT
CREATE POLICY "All authenticated users can view cash management"
ON cash_management FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can insert cash records"
ON cash_management FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can update cash records"
ON cash_management FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete cash records"
ON cash_management FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR DEBTS
CREATE POLICY "All authenticated users can view debts"
ON debts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can insert debts"
ON debts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can update debts"
ON debts FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete debts"
ON debts FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR PAYMENTS
CREATE POLICY "All authenticated users can view payments"
ON payments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can insert payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can update payments"
ON payments FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete payments"
ON payments FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR RECEIPTS
CREATE POLICY "All authenticated users can view receipts"
ON receipts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "All authenticated users can insert receipts"
ON receipts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can update receipts"
ON receipts FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "Managers can delete receipts"
ON receipts FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'manager'));

-- 📋 RLS POLICIES FOR AUDIT LOGS
CREATE POLICY "Managers can view audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'manager'));

CREATE POLICY "All authenticated users can insert audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 🔄 TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 📊 INDEXES FOR PERFORMANCE
CREATE INDEX idx_transactions_date ON transactions (date_time);
CREATE INDEX idx_transactions_cashier ON transactions (cashier_id);
CREATE INDEX idx_products_barcode ON products (barcode);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_debts_status ON debts (status);
CREATE INDEX idx_debts_type ON debts (type);
CREATE INDEX idx_cash_type ON cash_management (type);
CREATE INDEX idx_transaction_items_transaction ON transaction_items (transaction_id);
CREATE INDEX idx_transaction_items_product ON transaction_items (product_id);
CREATE INDEX idx_payments_transaction ON payments (transaction_id);
CREATE INDEX idx_receipts_transaction ON receipts (transaction_id);