# app.py
def calculate_discount(price, discount_percent):
    if price < 0 or discount_percent < 0 or discount_percent > 100:
        raise ValueError("Invalid parameters")
    return price * (1 - (discount_percent / 100))
