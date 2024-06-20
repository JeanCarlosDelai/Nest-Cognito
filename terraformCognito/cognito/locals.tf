locals {
  cognito_tag = {
    owner      = "jeanDelai"
    name       = "Agrocel"
    managed-by = "terraform"
  }

  email_verification_message = file("${path.module}/templates/email_verification.html")

  email_invitation_message = file("${path.module}/templates/email_invitation.html")
}
