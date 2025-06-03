output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_id" {
  value = module.vpc.public_subnet_ids[0]
}

output "ec2_public_ip" {
  value       = module.ec2.public_ip
  description = "Public IPv4 address of the first EC2 instance"
}

output "ec2_elastic_ip" {
  value = module.ec2.elastic_ip
  description = "Elastic IP address of the first EC2 instance (if any)"
}

output "ec2_private_key_pem" {
  value       = module.ec2.ec2_private_key_pem
  sensitive   = true
  description = "PEM-encoded private key for EC2 SSH access"
}

output "ec2_public_dns" {
  value       = module.ec2.public_dns
  description = "Public DNS of the first EC2 instance"
}

output "rds_endpoint" {
  value       = module.rds.endpoint
  description = "RDS endpoint"
}