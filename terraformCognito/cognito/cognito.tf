
//Describes a Cognito user pool
resource "aws_cognito_user_pool" "pool" {

  /** Basic Configuration */
  name = var.user_poll_name

  /** MFA */
  mfa_configuration = "OPTIONAL"

  /** E-mail Configuration */

  email_verification_subject = var.email_verification_subject
  email_verification_message = local.email_verification_message


  /** Configuration invite */
  admin_create_user_config {
    invite_message_template {
      email_message = local.email_invitation_message
      email_subject = var.email_invitation_subject
      sms_message   = var.sms_invitation_message
    }
  }

  software_token_mfa_configuration {
    enabled = true
  }
  username_configuration {
    case_sensitive = false
  }

  /** Password Policy */
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  auto_verified_attributes = var.login_attributes

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  /** Required Standard Attributes*/
  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "email"
    required            = true
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "birthdate"
    required            = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "last_name"
    required            = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  tags = local.cognito_tag

  provisioner "local-exec" {
    command = "echo ${self.id} >> user_pool_id.txt"
  }
}

resource "aws_cognito_user_pool_client" "cognito_client" {
  name         = aws_cognito_user_pool.pool.name
  user_pool_id = aws_cognito_user_pool.pool.id

  # Habilitando USER_PASSWORD_AUTH
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  provisioner "local-exec" {
    command = "echo ${self.id} >> cognito_client_id.txt"
  }
}

