-- Drop and recreate the order item input type with numeric product_id
DROP TYPE IF EXISTS order_item_input;
CREATE TYPE order_item_input AS (
    product_id TEXT,
    quantity INTEGER,
    price DECIMAL(10,2),
    selected_size TEXT,
    selected_color TEXT
);

-- Update the transaction function to handle the corrected types
CREATE OR REPLACE FUNCTION create_order_with_items(
    p_user_id UUID,
    p_total_amount DECIMAL(10,2),
    p_status TEXT,
    p_shipping_address_id UUID,
    p_payment_method TEXT,
    p_order_items order_item_input[]
) RETURNS TABLE (
    id UUID,
    user_id UUID,
    total_amount DECIMAL(10,2),
    status TEXT,
    shipping_address_id UUID,
    payment_method TEXT,
    created_at TIMESTAMPTZ
) AS $$
DECLARE
    v_order_id UUID;
    v_item order_item_input;
BEGIN
    -- Create the order within a transaction
    INSERT INTO "order" (
        user_id,
        total_amount,
        status,
        shipping_address_id,
        payment_method
    ) VALUES (
        p_user_id,
        p_total_amount,
        p_status,
        p_shipping_address_id,
        p_payment_method
    )
    RETURNING id INTO v_order_id;

    -- Insert all order items
    FOREACH v_item IN ARRAY p_order_items LOOP
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price,
            selected_size,
            selected_color
        ) VALUES (
            v_order_id,
            v_item.product_id,
            v_item.quantity,
            v_item.price,
            v_item.selected_size,
            v_item.selected_color
        );
    END LOOP;

    -- Return the created order
    RETURN QUERY 
    SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address_id, o.payment_method, o.created_at
    FROM "order" o
    WHERE o.id = v_order_id;

    -- If we get here, commit the transaction
    -- If any error occurs, the transaction will automatically rollback
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_order_with_items TO authenticated;

-- Force refresh of schema cache
NOTIFY pgrst, 'reload schema';