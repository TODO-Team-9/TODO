output "public_ip" {
  value = try(aws_instance.this[0].public_ip, null)
  description = "Public IP of the first EC2 instance (if any)"
}

output "elastic_ip" {
  value = try(aws_eip.this[0].public_ip, null)
  description = "Elastic IP address of the first EC2 instance (if any)"
}

output "public_dns" {
  value = try(aws_instance.this[0].public_dns, null)
  description = "Public DNS of the first EC2 instance (if any)"
}

output "ec2_private_key_pem" {
  value       = tls_private_key.ec2.private_key_pem
  sensitive   = true
  description = "PEM-encoded private key for EC2 SSH access"
}