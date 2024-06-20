output "user_pool_id" {
  description = "ID da user pool do Cognito"
  value       = aws_cognito_user_pool.pool.id
}
