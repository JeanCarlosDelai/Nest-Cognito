variable "user_poll_name" {
  description = "Nome da pool de usuários"
  type        = string
  default     = "TEST-COGNITO"
}

variable "login_attributes" {
  description = "Formas do usuário efetuar o login/ MFA"
  type        = list(string)
  default     = ["email"]
}

variable "location" {
  description = "Região onde os recursos serão criados na AWS"
  type        = string
  default     = "sa-east-1"
}

variable "external_id" {
  description = "Id externo único (Pode ser qualquer coisa)"
  type        = string
  default     = "exemplo"
}

# SMS Messages
variable "sms_authentication_message" {
  description = "Mensagem SMS de autenticação (MFA)"
  type        = string
  default     = "Seu código de autenticação é {####}"
}

variable "sms_verification_message" {
  description = "Mensagem SMS de verificação (MFA)"
  type        = string
  default     = "Seu código de verificação é {####}"
}

variable "sms_invitation_message" {
  description = "Mensagem SMS de convite (Senha temporária)"
  type        = string
  default     = "Usuário {username}, Sua senha temporária é {####}"
}

# Email subjects
variable "email_verification_subject" {
  description = "Assunto do e-mail de verificação"
  type        = string
  default     = "Seu código de verificação"
}


variable "email_invitation_subject" {
  description = "Assunto do e-mail de convite (Senha temporária)"
  type        = string
  default     = "Sua senha temporária"
}


