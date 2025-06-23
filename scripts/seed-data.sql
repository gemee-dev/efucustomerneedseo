-- Insert sample admin user (password: admin123)
INSERT INTO users (email, name, password_hash, role) VALUES 
('admin@company.com', 'Admin User', '$2b$10$rQZ8kHWfQxwjQxwjQxwjQOeKm5rQZ8kHWfQxwjQxwjQxwjQOeKm5', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample regular user (password: user123)
INSERT INTO users (email, name, password_hash, role) VALUES 
('user@example.com', 'Regular User', '$2b$10$rQZ8kHWfQxwjQxwjQxwjQOeKm5rQZ8kHWfQxwjQxwjQxwjQOeKm5', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample form submissions for testing
INSERT INTO form_submissions (
  email, name, company, service, budget, timeline, description, status
) VALUES 
(
  'john@example.com',
  'John Doe',
  'Acme Corp',
  'web-development',
  '10k-25k',
  '2-3-months',
  'We need a modern e-commerce website with payment integration.',
  'pending'
),
(
  'jane@startup.com',
  'Jane Smith',
  'Startup Inc',
  'ui-ux-design',
  '5k-10k',
  '1-month',
  'Looking for a complete UI/UX redesign of our mobile app.',
  'in-progress'
),
(
  'mike@business.com',
  'Mike Johnson',
  'Business Solutions',
  'digital-marketing',
  '25k-50k',
  '3-6-months',
  'Need comprehensive digital marketing strategy and implementation.',
  'completed'
);
