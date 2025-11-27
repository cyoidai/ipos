CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO org(name, description) VALUES
    ('Abbott Convenience', 'A chain of small, 24/7 neighborhood stores offering groceries, snacks, and gas.'),
    ('The Marketplace Retail', 'A large, multi-brand department store chain specializing in general merchandise.'),
    ('SwiftShip Logistics', 'A third-party logistics (3PL) provider focused on fast, last-mile e-commerce delivery.'),
    ('Urban Threads Apparel', 'A fast-fashion e-commerce site targeting Gen Z with trendy, affordable clothing.'),
    ('BrightBargain Deals', 'A discount liquidation website selling surplus and returned items at heavily reduced prices.'),
    ('Home Goods Emporium', 'A mid-to-high-end retailer selling furniture, décor, and kitchenware.'),
    ('ElectroMart Stores', 'A big-box electronics retailer known for competitive pricing and extensive warranties.'),
    ('Petal & Vine Florists', 'An online subscription service and local storefront for premium floral arrangements.'),
    ('Terra Coffee Co.', 'A global roaster and online seller of ethically sourced, single-origin coffee beans.');

INSERT INTO item (org_id, sku, name, description, qty, price, reorder_threshold) VALUES
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'CND-001', 'Chocolate Bar', 'Milk chocolate bar, 50g', 42, 1.49, 10),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'CND-002', 'Gummy Bears', 'Fruit-flavored gummy candy, 100g bag', 25, 2.29, 8),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'DRK-101', 'Bottled Water', '500mL purified bottled water', 73, 0.99, 20),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'DRK-102', 'Iced Tea', 'Sweetened lemon iced tea, 590mL bottle', 38, 1.89, 12),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'DRK-103', 'Energy Drink', 'Caffeinated energy drink, 355mL can', 19, 2.99, 10),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'SNK-201', 'Potato Chips', 'Classic salted potato chips, 200g bag', 34, 3.49, 10),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'SNK-202', 'Trail Mix', 'Nut and dried fruit mix, 150g pouch', 16, 4.99, 6),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'HHS-301', 'Hand Sanitizer', 'Travel-size alcohol hand sanitizer, 60mL', 28, 1.59, 10),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'HHS-302', 'AA Batteries (4-pack)', 'Alkaline AA batteries, 4 per pack', 12, 5.99, 4),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'PRD-401', 'Paper Towels', '2-pack of absorbent paper towel rolls', 14, 3.79, 6),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'FRZ-501', 'Ice Cream Sandwich', 'Vanilla ice cream between chocolate wafers', 21, 1.29, 10),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'FRZ-502', 'Frozen Burrito', 'Microwaveable bean and cheese burrito', 11, 2.49, 5);

INSERT INTO role(org_id, name, description, permission) VALUES
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'Manager', 'Managers', 1073741824),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'Supervisor', 'Supervisors', 100675703),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'Clerk', 'Clerks', 39);

INSERT INTO "user"(org_id, username, first_name, last_name, password, role_id) VALUES
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'jdoe', 'John', 'Doe', digest('password123', 'sha512'), (SELECT role.id FROM role INNER JOIN org ON org.id = role.org_id WHERE role.name = 'Manager' AND org.name = 'Abbott Convenience')),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'asmith', 'Alice', 'Smith', digest('letmein', 'sha512'), (SELECT role.id FROM role INNER JOIN org ON org.id = role.org_id WHERE role.name = 'Supervisor' AND org.name = 'Abbott Convenience')),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'bwilson', 'Bob', 'Wilson', digest('qwerty', 'sha512'), (SELECT role.id FROM role INNER JOIN org ON org.id = role.org_id WHERE role.name = 'Clerk' AND org.name = 'Abbott Convenience')),
    ((SELECT id FROM org WHERE name = 'Abbott Convenience'), 'cnguyen', 'Chi', 'Nguyen', digest('secretpass', 'sha512'), (SELECT role.id FROM role INNER JOIN org ON org.id = role.org_id WHERE role.name = 'Clerk' AND org.name = 'Abbott Convenience'));
