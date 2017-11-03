User.create(email: 'admin@devpointlabs.com', password: ENV['ADMIN_PASSWORD'], role: 'admin')
User.create(email: 'user@devpointlabs.com', password: ENV['TA_PASSWORD'])
puts 'Users Seeded'
