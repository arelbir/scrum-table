resource "stackit_postgresflex_instance" "aksa-postgres" {
  project_id = var.project_id
  name       = "aksa"
  acl = [

    "193.148.160.0/19",
    "45.129.40.0/21"
  ]
  backup_schedule = "00 00 * * *"
  flavor = {
    cpu = 2
    ram = 4
  }
  replicas = 3
  storage = {
    class = "premium-perf6-stackit"
    size  = 5
  }
  version = 15
}
resource "stackit_postgresflex_user" "aksa" {
  project_id  = var.project_id
  instance_id = stackit_postgresflex_instance.aksa-postgres.instance_id
  username    = "aksa"
  roles       = ["login", "createdb"]
}

resource "local_file" "postgres_connection_url_file" {
  filename = "${path.module}/postgres_connection_url.txt"
  content = format(
    "postgresql://%s:%s@%s:%d/%s",
    stackit_postgresflex_user.aksa.username,
    stackit_postgresflex_user.aksa.password,
    stackit_postgresflex_user.aksa.host,
    stackit_postgresflex_user.aksa.port,
    "stackit"
  )
}

